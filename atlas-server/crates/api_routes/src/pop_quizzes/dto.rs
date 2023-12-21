use atlas_db_schema::models::PopQuiz;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewPopQuizDTO {
    pub name: String,
    pub description: String,
    pub creator: i32,
    pub questions: Vec<String>
}

#[derive(Serialize)]
pub struct NewPopQuizMessage {
    pub message: String,
    pub quiz_id: i32
}

#[derive(Deserialize)]
pub struct GetPopQuizDTO {
    pub quiz_id: i32
}

#[derive(Serialize)]
pub struct GetPopQuizMessage {
    pub message: String,
    pub quiz: PopQuiz
}
