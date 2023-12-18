use actix_web::{delete, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, announcements::{get_announcement_with_id, delete_announcement_with_id}, classrooms::{get_classroom_with_id, update_classroom_with_id}};
use atlas_db_schema::models::{User, Announcement, Classroom, NewClassroom};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;

use crate::dto::Message;

use super::dto::GetAnnouncementDTO;

#[delete("")]
pub async fn delete_announcement(request: HttpRequest, data: web::Json<GetAnnouncementDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }

    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let announcement_option: Option<Announcement> = get_announcement_with_id(connection, data.announcement_id);
            match announcement_option {
                Some(announcement) => {
                    match announcement.sender_id == user.id {
                        true => {
                            let classroom_option: Option<Classroom> = get_classroom_with_id(connection, announcement.classroom_id);
                            if classroom_option.is_none() {
                                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                            }

                            let mut classroom = classroom_option.unwrap();
                            for n in 0..classroom.announcement_ids.len() {
                                if classroom.announcement_ids.get(n).unwrap().to_owned() == announcement.id {
                                    classroom.announcement_ids.remove(n);
                                }
                            }
                            let classroom_update = serde_json::from_str::<NewClassroom>(serde_json::to_string(&classroom).unwrap().as_str()).unwrap();
                            let update_option: Option<Classroom> = update_classroom_with_id(connection, classroom.id, classroom_update);
                            if update_option.is_none() {
                                return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update classroom".to_string() }));
                            }

                            match delete_announcement_with_id(connection, announcement.id) {
                                true => Ok(HttpResponse::Ok().json(Message { message: "Deleted announcement".to_string() })),
                                _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to delete announcement".to_string() }))
                            }
                        },
                        _ => Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User doesn't own announcement".to_string() }))
                    }
                },
                None => {
                    Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get announcement".to_string() }))
                }
            }
        }
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
