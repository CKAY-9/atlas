use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewUnitDTO {
    pub name: String,
    pub description: String,
    pub classroom_id: i32
}

#[derive(Serialize)]
pub struct NewUnitMessage {
    pub message: String,
    pub unit_id: i32
}
