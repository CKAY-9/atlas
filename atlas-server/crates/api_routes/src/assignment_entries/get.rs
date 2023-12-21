use actix_web::{get, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, assignment_entries::get_assignment_entry_with_id, classrooms::get_classroom_with_id, assignments::get_assignment_with_id};
use atlas_db_schema::models::{User, AssignmentEntry, Classroom, Assignment};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{GetAssignmentEntryDTO, GetAssignmentEntryMessage, GetStudentAssignmentEntryDTO};

#[get("")]
pub async fn get_assignment_entry(request: HttpRequest, query: web::Query<GetAssignmentEntryDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let assignment_entry_option: Option<AssignmentEntry> = get_assignment_entry_with_id(connection, query.entry_id);
            match assignment_entry_option {
                Some(assignment_entry) => {
                    let assignment_option: Option<Assignment> = get_assignment_with_id(connection, assignment_entry.assignment_id);
                    if assignment_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment".to_string() }));
                    }

                    let assignment = assignment_option.unwrap();
                    let classroom_option: Option<Classroom> = get_classroom_with_id(connection, assignment.classroom_id);
                    if classroom_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                    }

                    let classroom = classroom_option.unwrap();
                    if assignment_entry.student_id != user.id && !classroom.teacher_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't allowed to view entry".to_string() }));
                    }

                    Ok(HttpResponse::Ok().json(GetAssignmentEntryMessage { message: "Fetched entry".to_string(), entry: assignment_entry }))
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment entry".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}

#[get("/student")]
pub async fn get_assignment_entry_for_student(request: HttpRequest, query: web::Query<GetStudentAssignmentEntryDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let assignment_entry_option: Option<AssignmentEntry> = get_assignment_entry_with_id(connection, query.assignment_id);
            if assignment_entry_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment entry".to_string() }));
            }

            let assignment_entry = assignment_entry_option.unwrap();
            let assignment_option: Option<Assignment> = get_assignment_with_id(connection, assignment_entry.assignment_id);
            if assignment_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment".to_string() }));
            }

            let assignment = assignment_option.unwrap();
            let classroom_option: Option<Classroom> = get_classroom_with_id(connection, assignment.classroom_id);
            if classroom_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
            }

            let classroom = classroom_option.unwrap();
            if assignment_entry.student_id != user.id && !classroom.teacher_ids.contains(&user.id) {
                return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't allowed to see entry".to_string() }));
            }

            Ok(HttpResponse::Ok().json(GetAssignmentEntryMessage { message: "Fetched entry".to_string(), entry: assignment_entry }))
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
