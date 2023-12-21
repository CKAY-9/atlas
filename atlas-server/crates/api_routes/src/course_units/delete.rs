use actix_web::{delete, HttpResponse, HttpRequest, web, Responder};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, units::{get_unit_with_id, delete_unit_with_id}, assignments::{get_assignment_with_id, update_assignment_with_id}, classrooms::get_classroom_with_id};
use atlas_db_schema::models::{User, CourseUnit, NewAssignment, Classroom};
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
            let unit_option: Option<CourseUnit> = get_unit_with_id(connection, data.unit_id);
            match unit_option {
                Some(unit) => {
                    let classroom_option: Option<Classroom> = get_classroom_with_id(connection, unit.classroom_id);
                    if classroom_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                    }

                    let classroom = classroom_option.unwrap();
                    if !classroom.teacher_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't a teacher".to_string() }));
                    }

                    for assignment_id in unit.assignment_ids {
                        let assignment_option = get_assignment_with_id(connection, assignment_id);
                        if assignment_option.is_none() {
                            continue;
                        }
                        let mut assignment = assignment_option.unwrap();
                        assignment.unit_id = 0;
                        let assignment_update: NewAssignment = serde_json::from_str::<NewAssignment>(serde_json::to_string(&assignment).unwrap().as_str()).unwrap();
                        update_assignment_with_id(connection, assignment.id, assignment_update);
                    }

                    match delete_unit_with_id(connection, unit.id) {
                        true => Ok(HttpResponse::Ok().json(Message { message: "Deleted unit".to_string() })),
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to delete unit".to_string() }))
                    }
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get unit".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
