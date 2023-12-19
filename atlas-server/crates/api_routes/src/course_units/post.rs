use actix_web::{post, HttpRequest, Responder, web, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, classrooms::{get_classroom_with_id, update_classroom_with_id}, units::create_new_unit};
use atlas_db_schema::models::{User, Classroom, NewCourseUnit, CourseUnit, NewClassroom};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewUnitDTO, NewUnitMessage};

#[post("")]
pub async fn create_course_unit(request: HttpRequest, data: web::Json<NewUnitDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
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

                    let new_unit = NewCourseUnit {
                        name: data.name.clone(),
                        description: data.description.clone(),
                        classroom_id: classroom.id,
                        assignment_ids: vec![]
                    };
                    let insert_option: Option<CourseUnit> = create_new_unit(connection, new_unit);
                    match insert_option {
                        Some(insert) => {
                            classroom.unit_ids.push(insert.id);
                            let classroom_update: NewClassroom = serde_json::from_str::<NewClassroom>(serde_json::to_string(&classroom).unwrap().as_str()).unwrap();
                            let update_option: Option<Classroom> = update_classroom_with_id(connection, classroom.id, classroom_update);
                            if update_option.is_none() {
                                return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update classroom".to_string() }));
                            }

                            Ok(HttpResponse::Ok().json(NewUnitMessage { message: "Created unit".to_string(), unit_id: insert.id }))
                        },
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create unit".to_string() }))
                    }
                },
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
