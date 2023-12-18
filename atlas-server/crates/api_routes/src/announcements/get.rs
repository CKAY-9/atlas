use actix_web::{get, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{announcements::get_announcement_with_id, classrooms::get_classroom_with_id, users::get_user_with_token};
use atlas_db_schema::models::{Classroom, Announcement, User};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{GetAnnouncementDTO, GetAnnouncementMessage};

#[get("")]
pub async fn get_announcement_from_id(request: HttpRequest, data: web::Query<GetAnnouncementDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
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
                    let classroom_option: Option<Classroom> = get_classroom_with_id(connection, announcement.classroom_id);
                    if classroom_option.is_none() {
                        return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
                    }

                    let classroom = classroom_option.unwrap();
                    if !classroom.student_ids.contains(&user.id) && !classroom.teacher_ids.contains(&user.id) {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User not in class".to_string() }));
                    }

                    Ok(HttpResponse::Ok().json(GetAnnouncementMessage { message: "Fetched announcement".to_string(), announcement }))
                },
                None => {
                    Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get announcement".to_string() }))
                }
            }
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
