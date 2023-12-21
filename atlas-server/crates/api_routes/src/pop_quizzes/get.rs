use actix_web::{get, HttpRequest, web, Responder, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{pop_quizzes::get_pop_quiz_with_id, users::get_user_with_token};
use atlas_db_schema::models::{PopQuiz, User};
use atlas_utils::extract_header_value;
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{GetPopQuizDTO, GetPopQuizMessage};

#[get("")]
pub async fn get_pop_quiz(request: HttpRequest, query: web::Query<GetPopQuizDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }

    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(_user) => {
            let quiz_option: Option<PopQuiz> = get_pop_quiz_with_id(connection, query.quiz_id);
            match quiz_option {
                Some(quiz) => Ok(HttpResponse::Ok().json(GetPopQuizMessage { message: "Fetched quiz".to_string(), quiz })),
                _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get quiz".to_string() }))
            }
        },
        _ => Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
    }
}
