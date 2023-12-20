use std::time::SystemTime;

use actix_web::{post, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, classrooms::get_classroom_with_id, materials::create_new_material};
use atlas_db_schema::models::{User, Classroom, NewCourseMaterial};
use atlas_utils::{extract_header_value, iso8601};
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewCourseMaterialDTO, NewCourseMaterialMessage};

#[post("")]
pub async fn create_course_material(request: HttpRequest, data: web::Json<NewCourseMaterialDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
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
                    
                    let new_material = NewCourseMaterial {
                        name: data.name.clone(),
                        classroom_id: data.classroom_id.clone(),
                        posted: iso8601(&SystemTime::now()),
                        content: data.content.clone(),
                        attachments: data.attachments.clone(),
                        teacher_id: data.teacher_id.clone(),
                        unit_id: data.unit_id.clone()
                    };
                    let insert_option = create_new_material(connection, new_material);
                    match insert_option {
                        Some(insert) => Ok(HttpResponse::Ok().json(NewCourseMaterialMessage { message: "Created material".to_string(), material_id: insert.id })),
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create material".to_string() }))
                    }
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() })   )
            }
        }
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
