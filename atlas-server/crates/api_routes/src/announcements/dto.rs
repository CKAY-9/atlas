use atlas_db_schema::models::Announcement;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct NewAnnouncementDTO {
    pub content: String,
    pub classroom_id: i32
}

#[derive(Serialize)]
pub struct AnnouncementIDMessage {
    pub message: String,
    pub announcement_id: i32
}

#[derive(Serialize)]
pub struct GetAnnouncementMessage {
    pub message: String,
    pub announcement: Announcement
}

#[derive(Deserialize)]
pub struct GetAnnouncementDTO {
    pub announcement_id: i32
}
