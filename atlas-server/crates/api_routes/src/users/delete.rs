use actix_web::{delete, HttpRequest, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::users::{delete_user_with_id, get_user_with_token};
use atlas_db_schema::models::User;
use atlas_utils::extract_header_value;
use reqwest::StatusCode;

use crate::dto::Message;

#[delete("")]
pub async fn delete_user(request: HttpRequest) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(user) => {
            match delete_user_with_id(connection, user.id) {
                true => Ok(HttpResponse::Ok().json(Message { message: "Deleted user".to_string() })),
                false => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to delete user".to_string() }))
            }
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
