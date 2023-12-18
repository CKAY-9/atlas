use actix_web::{delete, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, classrooms::{get_classroom_with_id, delete_classroom_with_id}};
use atlas_db_schema::models::{User, Classroom};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;

use crate::dto::Message;

use super::dto::GetClassroomDTO;

#[delete("")]
pub async fn delete_classroom(request: HttpRequest, data: web::Json<GetClassroomDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(user) => {
            let classroom_option: Option<Classroom> = get_classroom_with_id(connection, data.classroom_id);
            match classroom_option {
                Some(classroom) => {
                    if !classroom.teacher_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't a teacher".to_string() }));
                    }

                    match delete_classroom_with_id(connection, data.classroom_id) {
                        true => Ok(HttpResponse::Ok().json(Message { message: "Deleted classroom".to_string() })),
                        false => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to delete classroom".to_string() }))
                    }
                },
                None => {
                    Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }))
                }
            }
        }, 
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
