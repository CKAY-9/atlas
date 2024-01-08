use atlas_db_schema::models::AssignmentMessage;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewMessageDTO {
    pub content: String,
    pub assignment_id: i32,
    pub sender: i32,
    pub receiver: i32
}

#[derive(Deserialize)]
pub struct GetMessageDTO {
    pub comment_id: i32
}

#[derive(Serialize)]
pub struct GetMessageMessage {
    pub message: String,
    pub assignment_message: AssignmentMessage
}
