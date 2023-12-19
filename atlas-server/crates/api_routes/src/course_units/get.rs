use actix_web::{get, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, units::get_unit_with_id, classrooms::get_classroom_with_id};
use atlas_db_schema::models::{User, CourseUnit, Classroom};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{GetUnitDTO, GetUnitMessage};

#[get("")]
pub async fn get_unit(request: HttpRequest, query: web::Query<GetUnitDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
   let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(user) => {
            let unit_option: Option<CourseUnit> = get_unit_with_id(connection, query.unit_id);
            match unit_option {
                Some(unit) => {
                    let classroom_option: Option<Classroom> = get_classroom_with_id(connection, unit.classroom_id);
                    if classroom_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                    }

                    let classroom: Classroom = classroom_option.unwrap();
                    if !classroom.teacher_ids.contains(&user.id) && !classroom.student_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User not in classroom".to_string() }));
                    }

                    Ok(HttpResponse::Ok().json(GetUnitMessage { message: "Fetched unit".to_string(), unit }))
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get unit".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
 
}
