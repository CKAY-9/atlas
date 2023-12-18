use atlas_db_schema::models::Classroom;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewClassroomDTO {
    pub name: String
}

#[derive(Serialize)]
pub struct NewClassroomMessage {
    pub message: String,
    pub classroom_id: i32
}

#[derive(Deserialize)]
pub struct GetClassroomDTO {
    pub classroom_id: i32
}

#[derive(Serialize)]
pub struct GetClassroomMessage {
    pub message: String,
    pub classroom: Classroom
}

#[derive(Deserialize)]
pub struct GetClassroomFromCodeDTO {
    pub classroom_code: String
}

#[derive(Deserialize)]
pub struct UpdateClassroomDTO {
    pub classroom_id: i32,
    pub name: String,
    pub description: String
}
