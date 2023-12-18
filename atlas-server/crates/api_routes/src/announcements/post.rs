use std::time::SystemTime;

use actix_web::{post, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, classrooms::{get_classroom_with_id, update_classroom_with_id}, announcements::create_new_announcement};
use atlas_db_schema::models::{Classroom, NewAnnouncement, User, Announcement, NewClassroom};
use atlas_utils::{extract_header_value, iso8601};
use reqwest::StatusCode;
use crate::{announcements::dto::{NewAnnouncementDTO, AnnouncementIDMessage}, dto::Message};

#[post("")]
pub async fn create_announcement(request: HttpRequest, data: web::Json<NewAnnouncementDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }

    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let classroom_option: Option<Classroom> = get_classroom_with_id(connection, data.classroom_id);
            match classroom_option {
                Some(mut classroom) => {
                    if !classroom.teacher_ids.contains(&user.id) && !classroom.student_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User not in classroom".to_string() }));
                    }

                    let insert_option: Option<Announcement> = create_new_announcement(connection, NewAnnouncement {
                        classroom_id: classroom.id,
                        content: data.content.clone(),
                        posted: iso8601(&SystemTime::now()),
                        sender_id: user.id,
                        seen_by: vec![]
                    });
                    if insert_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create announcement".to_string() }));
                    }

                    let insert = insert_option.as_ref().unwrap();

                    classroom.announcement_ids.push(insert.id);
                    let classroom_update: NewClassroom = serde_json::from_str::<NewClassroom>(serde_json::to_string(&classroom).unwrap().as_str()).unwrap();
                    let update_option: Option<Classroom> = update_classroom_with_id(connection, classroom.id, classroom_update);
                    if update_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update classroom".to_string() }));
                    }

                    Ok(HttpResponse::Ok().json(AnnouncementIDMessage { message: "Created announcement".to_string(), announcement_id: insert_option.unwrap().id }))
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
