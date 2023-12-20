use actix_web::{delete, HttpResponse, HttpRequest, web, Responder};
use atlas_db::create_connection;
use atlas_db_crud::users::get_user_with_token;
use atlas_db_schema::models::User;
use atlas_utils::extract_header_value;
use reqwest::StatusCode;

use crate::dto::Message;

use super::dto::GetUnitDTO;

#[delete("")]
pub async fn delete_unit(request: HttpRequest, data: web::Json<GetUnitDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(user) => {
            Ok(HttpResponse::Ok().body(""))
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
