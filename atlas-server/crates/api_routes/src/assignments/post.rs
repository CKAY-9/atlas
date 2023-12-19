use std::time::SystemTime;

use actix_web::{post, Responder, HttpRequest, HttpResponse, web};
use atlas_db::create_connection;
use atlas_db_crud::{classrooms::{get_classroom_with_id, update_classroom_with_id}, users::get_user_with_token, assignments::create_new_assignment, units::{get_unit_with_id, update_unit_with_id}};
use atlas_db_schema::models::{Classroom, User, NewAssignment, Assignment, NewClassroom, CourseUnit, NewCourseUnit};
use atlas_utils::{extract_header_value, iso8601};
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewAssignmentDTO, NewAssignmentMessage};

#[post("")]
pub async fn create_assignment(request: HttpRequest, data: web::Json<NewAssignmentDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
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

                    let new_assignment = NewAssignment {
                        name: data.name.clone(),
                        unit_id: data.unit_id.clone(),
                        attachments: data.attachments.clone(),
                        teacher_id: user.id,
                        classroom_id: classroom.id,
                        deadline: data.deadline.to_string(),
                        posted: iso8601(&SystemTime::now()),
                        rubric_id: data.rubric_id.clone(),
                        description: data.description.clone()
                    };

                    let insert_option: Option<Assignment> = create_new_assignment(connection, new_assignment);
                    match insert_option {
                        Some(insert) => {
                            classroom.assignment_ids.push(insert.id);
                            let class_update: NewClassroom = serde_json::from_str::<NewClassroom>(serde_json::to_string(&classroom).unwrap().as_str()).unwrap();
                            let class_update_option: Option<Classroom> = update_classroom_with_id(connection, classroom.id, class_update);
                            match class_update_option {
                                Some(_) => {
                                    if data.unit_id != 0 {
                                        let unit_option: Option<CourseUnit> = get_unit_with_id(connection, data.unit_id);
                                        if unit_option.is_none() {
                                            return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to get unit".to_string() }));
                                        }
                                        let mut unit = unit_option.unwrap();
                                        unit.assignment_ids.push(insert.id);
                                        let unit_update: NewCourseUnit = serde_json::from_str::<NewCourseUnit>(serde_json::to_string(&unit).unwrap().as_str()).unwrap();
                                        let unit_update_option: Option<CourseUnit> = update_unit_with_id(connection, unit.id, unit_update);
                                        if unit_update_option.is_none() {
                                            return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update unit".to_string() }));
                                        }
                                    }

                                    Ok(HttpResponse::Ok().json(NewAssignmentMessage { message: "Created assignment".to_string(), assignment_id: insert.id }))
                                },
                                _ => Ok(HttpResponse::Ok().json(Message { message: "Failed to update classroom".to_string() }))
                            }
                        },
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create assignment".to_string() }))
                    }
                },
                None => {
                    Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }))
                }
            }
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
