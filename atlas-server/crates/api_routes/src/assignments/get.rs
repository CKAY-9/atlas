use actix_web::{HttpResponse, HttpRequest, web, Responder, get};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, classrooms::get_classroom_with_id, assignments::get_assignment_with_id};
use atlas_db_schema::models::{User, Classroom, Assignment};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;

use super::dto::{GetAssignmentDTO, GetAssignmentMessage};

#[get("")]
pub async fn get_assignment(request: HttpRequest, query: web::Query<GetAssignmentDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(user) => {
            let assignment_option: Option<Assignment> = get_assignment_with_id(connection, query.assignment_id);
            match assignment_option {
                Some(assignment) => {
                    let classroom_option: Option<Classroom> = get_classroom_with_id(connection, assignment.classroom_id);
                    if classroom_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                    }

                    let classroom = classroom_option.unwrap();
                    if !classroom.teacher_ids.contains(&user.id) && !classroom.student_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User not in classroom".to_string() }));
                    }

                    Ok(HttpResponse::Ok().json(GetAssignmentMessage { message: "Fetched assignment".to_string(), assignment }))
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }

}
