use atlas_db_schema::models::Assignment;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewAssignmentDTO {
    pub classroom_id: i32,
    pub name: String,
    pub description: String,
    pub rubric_id: i32,
    pub unit_id: i32,
    pub attachments: Vec<String>,
    pub deadline: String
}

#[derive(Serialize)]
pub struct NewAssignmentMessage {
    pub message: String,
    pub assignment_id: i32
}

#[derive(Deserialize)]
pub struct GetAssignmentDTO {
    pub assignment_id: i32
}

#[derive(Serialize)]
pub struct GetAssignmentMessage {
    pub message: String,
    pub assignment: Assignment
}
