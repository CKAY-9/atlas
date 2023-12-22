use atlas_db_schema::models::User;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct UserOAuthDTO {
    pub code: String
}

#[derive(Deserialize)]
pub struct DiscordInitialDTO {
    pub access_token: String,
    pub token_type: String,
}

#[derive(Deserialize)]
pub struct DiscordUserDTO {
    pub global_name: String,
    pub avatar: String,
    pub id: String,
}

#[derive(Deserialize)]
pub struct GithubInitialDTO {
    pub access_token: String,
    pub token_type: String,
    pub scope: String,
}

#[derive(Deserialize)]
pub struct GithubUserDTO {
    pub login: String,
    pub avatar_url: String,
    pub id: u64,
}

#[derive(Deserialize)]
pub struct GoogleInitialDTO {
    pub access_token: String,
    pub scope: String,
    pub token_type: String
}

#[derive(Deserialize)]
pub struct GoogleUserDTO {
    pub locale: String,
    pub given_name: String,
    pub picture: String,
    pub id: String,
    pub name: String
}

#[derive(Serialize)]
pub struct UserResponseMessage {
    pub message: String,
    pub user: User
}

#[derive(Deserialize)]
pub struct GetUserDTO {
    pub user_id: i32
}

#[derive(Serialize)]
pub struct GetUserMessage {
    pub message: String,
    pub user: User
}
