use std::time::SystemTime;
use actix_web::{HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, assignments::get_assignment_with_id, classrooms::get_classroom_with_id, assignment_messages::create_new_assignment_message};
use atlas_db_schema::models::{User, NewAssignmentMessage};
use atlas_utils::{extract_header_value, iso8601};
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewMessageDTO, GetMessageMessage};

pub async fn new_assignment_message(request: HttpRequest, data: web::Json<NewMessageDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(user) => {
            let assignment_option = get_assignment_with_id(connection, data.assignment_id);
            match assignment_option {
                Some(assignment) => {
                    let classroom_option = get_classroom_with_id(connection, assignment.classroom_id);
                    match classroom_option {
                        Some(classroom) => {
                            if !classroom.teacher_ids.contains(&user.id) && !classroom.student_ids.contains(&user.id) {
                                return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User not in classroom".to_string() }));
                            }

                            let new_message = NewAssignmentMessage {
                                sender_id: data.sender.clone(),
                                receiver_id: data.receiver.clone(),
                                content: data.content.clone(),
                                assignment_id: assignment.id,
                                posted: iso8601(&SystemTime::now())
                            };

                            let insert_option = create_new_assignment_message(connection, new_message);
                            match insert_option {
                                Some(insert) => Ok(HttpResponse::Ok().json(GetMessageMessage { message: "Created message".to_string(), assignment_message: insert })),
                                _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create message".to_string() }))
                            }
                        },
                        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }))
                    }
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
