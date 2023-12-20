use atlas_db_schema::models::AssignmentEntry;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewAssignmentEntryDTO {
    pub assignment_id: i32,
    pub attachments: Vec<String>
}

#[derive(Serialize)]
pub struct NewAssignmentEntryMessage {
    pub message: String,
    pub entry_id: i32
}

#[derive(Deserialize)]
pub struct GetAssignmentEntryDTO {
    pub entry_id: i32
}

#[derive(Serialize)]
pub struct GetAssignmnetEntryMesssage {
    pub message: String,
    pub entry: AssignmentEntry
}
