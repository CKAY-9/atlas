use actix_web::{put, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, classrooms::{get_classroom_with_id, update_classroom_with_id}};
use atlas_db_schema::models::{User, Classroom};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{UpdateClassroomDTO, GetClassroomMessage};

#[put("")]
pub async fn update_classroom(request: HttpRequest, data: web::Json<UpdateClassroomDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
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
                Some(mut classroom) => {
                    if !classroom.teacher_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't a teacher".to_string() }));
                    }
                    
                    classroom.name = data.name.clone();
                    classroom.description = data.description.clone();
                    let class_update = serde_json::from_str(serde_json::to_string(&classroom).unwrap().as_str()).unwrap();
                    let update_option: Option<Classroom> = update_classroom_with_id(connection, data.classroom_id, class_update);
                    if update_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update classroom".to_string() }));
                    }
                    
                    Ok(HttpResponse::Ok().json(GetClassroomMessage { message: "Updated classroom".to_string(), classroom }))
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


