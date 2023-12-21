use actix_web::{post, HttpRequest, Responder, web, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, assignments::get_assignment_with_id, classrooms::get_classroom_with_id, assignment_entries::create_new_assignment_entry};
use atlas_db_schema::models::{User, Assignment, NewAssignmentEntry, AssignmentEntry};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewAssignmentEntryDTO, NewAssignmentEntryMessage};

#[post("")]
pub async fn new_assignment_entry(request: HttpRequest, data: web::Json<NewAssignmentEntryDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let assignment_option: Option<Assignment> = get_assignment_with_id(connection, data.assignment_id);
            match assignment_option {
                Some(assignment) => {
                    let classroom_option = get_classroom_with_id(connection, assignment.classroom_id);
                    if classroom_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                    }

                    let classroom = classroom_option.unwrap();
                    if !classroom.teacher_ids.contains(&user.id) && !classroom.student_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't in classroom".to_string() }));
                    }

                    let new_entry = NewAssignmentEntry {
                        student_id: data.student_id,
                        assignment_id: assignment.id,
                        attachments: data.attachments.clone(),
                        grade: 0f32,
                        submitted: "".to_string(),
                        turned_in: false
                    };
                    let insert_option: Option<AssignmentEntry> = create_new_assignment_entry(connection, new_entry);
                    match insert_option {
                        Some(insert) => Ok(HttpResponse::Ok().json(NewAssignmentEntryMessage { message: "Created entry".to_string(), entry_id: insert.id })),
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create entry".to_string() }))
                    }
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
