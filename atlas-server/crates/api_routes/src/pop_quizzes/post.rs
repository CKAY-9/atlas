use std::time::SystemTime;

use actix_web::{post, HttpResponse, HttpRequest, Responder, web};
use atlas_db::create_connection;
use atlas_db_crud::{users::get_user_with_token, pop_quizzes::create_new_pop_quiz};
use atlas_db_schema::models::{User, NewPopQuiz, PopQuiz};
use atlas_utils::{extract_header_value, iso8601};
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewPopQuizDTO, NewPopQuizMessage};

#[post("")]
pub async fn new_pop_quiz(request: HttpRequest, data: web::Json<NewPopQuizDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }

    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            let new_quiz = NewPopQuiz {
                name: data.name.clone(),
                creator: user.id,
                questions: data.questions.clone(),
                posted: iso8601(&SystemTime::now()),
                description: data.description.clone()
            };

            let insert_option: Option<PopQuiz> = create_new_pop_quiz(connection, new_quiz);
            match insert_option {
                Some(insert) => Ok(HttpResponse::Ok().json(NewPopQuizMessage { message: "Created quiz".to_string(), quiz_id: insert.id })),
                _ => Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create pop quiz".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
