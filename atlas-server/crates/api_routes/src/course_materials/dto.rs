use atlas_db_schema::models::CourseMaterial;
use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
pub struct NewCourseMaterialDTO {
    pub name: String,
    pub teacher_id: i32,
    pub classroom_id: i32,
    pub unit_id: i32,
    pub content: String,
    pub attachments: Vec<String>
}

#[derive(Serialize)]
pub struct NewCourseMaterialMessage {
    pub message: String,
    pub material_id: i32
}

#[derive(Deserialize)]
pub struct GetCourseMaterialDTO {
    pub material_id: i32
}

#[derive(Serialize)]
pub struct GetCourseMaterialMessage {
    pub message: String,
    pub material: CourseMaterial
}
