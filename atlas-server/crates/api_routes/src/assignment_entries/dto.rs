use atlas_db_schema::models::AssignmentEntry;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewAssignmentEntryDTO {
    pub assignment_id: i32,
    pub student_id: i32,
    pub attachments: Vec<String>
}

#[derive(Serialize)]
pub struct NewAssignmentEntryMessage {
    pub message: String,
    pub entry_id: i32
}

#[derive(Deserialize)]
pub struct UpdateAssignmentEntryDTO {
    pub entry_id: i32,
    pub grade: f32,
    pub submitted: String,
    pub turned_in: bool,
    pub attachments: Vec<String>
}

#[derive(Deserialize)]
pub struct GetAssignmentEntryDTO {
    pub entry_id: i32
}

#[derive(Deserialize)]
pub struct GetStudentAssignmentEntryDTO {
    pub student_id: i32,
    pub assignment_id: i32
}

#[derive(Serialize)]
pub struct GetAssignmentEntryMessage {
    pub message: String,
    pub entry: AssignmentEntry
}
