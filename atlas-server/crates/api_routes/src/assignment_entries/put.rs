use std::time::SystemTime;
use actix_web::{put, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, assignment_entries::{get_assignment_entry_with_id, update_assignment_entry_with_id}, assignments::get_assignment_with_id, classrooms::get_classroom_with_id};
use atlas_db_schema::models::{User, AssignmentEntry, Assignment, Classroom, NewAssignmentEntry};
use atlas_utils::{extract_header_value, iso8601};
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{UpdateAssignmentEntryDTO, GetAssignmentEntryMessage};

#[put("")]
pub async fn update_assignment_entry(request: HttpRequest, data: web::Json<UpdateAssignmentEntryDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let entry_option: Option<AssignmentEntry> = get_assignment_entry_with_id(connection, data.entry_id);
            if entry_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get entry".to_string() }));
            }
    
            let entry = entry_option.unwrap();
            let assignment_option: Option<Assignment> = get_assignment_with_id(connection, entry.assignment_id);
            if assignment_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get assignment".to_string() }));
            }

            let assignment = assignment_option.unwrap();
            let classroom_option: Option<Classroom> = get_classroom_with_id(connection, assignment.classroom_id);
            if classroom_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
            }

            let classroom = classroom_option.unwrap();
            
            match classroom.teacher_ids.contains(&user.id) {
                true => {
                    let update_entry = NewAssignmentEntry {
                        student_id: entry.student_id,
                        assignment_id: entry.assignment_id,
                        attachments: entry.attachments,
                        submitted: entry.submitted,
                        turned_in: entry.turned_in,
                        grade: data.grade.clone(),
                    };

                    let update_option: Option<AssignmentEntry> = update_assignment_entry_with_id(connection, entry.id, update_entry);
                    match update_option {
                        Some(update) => Ok(HttpResponse::Ok().json(GetAssignmentEntryMessage { message: "Updated entry".to_string(), entry: update })),
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update entry".to_string() }))
                    }
                },
                false => {
                    if user.id != entry.student_id {
                        return Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "User isn't allowed to view entry".to_string() }));
                    }

                    let update_entry = NewAssignmentEntry {
                        student_id: entry.student_id,
                        assignment_id: entry.assignment_id,
                        attachments: data.attachments.clone(),
                        submitted: match data.turned_in { true => iso8601(&SystemTime::now()), false => entry.submitted },
                        turned_in: data.turned_in,
                        grade: entry.grade
                    };
                    let update_option: Option<AssignmentEntry> = update_assignment_entry_with_id(connection, entry.id, update_entry);
                    match update_option {
                        Some(update) => Ok(HttpResponse::Ok().json(GetAssignmentEntryMessage { message: "Updated entry".to_string(), entry: update })),
                        _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update entry".to_string() }))
                    }
                }
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
