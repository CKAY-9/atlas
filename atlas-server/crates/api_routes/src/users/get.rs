use std::time::SystemTime;
use actix_web::{get, web::{self, Redirect}, HttpResponse, Responder, HttpRequest};
use atlas_db_schema::models::{User, NewUser};
use reqwest::StatusCode;
use crate::{users::dto::{GetUserDTO, GetUserMessage, GoogleInitialDTO, UserOAuthDTO, DiscordUserDTO, DiscordInitialDTO, GithubUserDTO, GithubInitialDTO, UserResponseMessage}, dto::Message};
use atlas_utils::{get_discord_api_url, get_env_var, get_local_api_url, iso8601, extract_header_value};
use atlas_db::create_connection;
use atlas_db_crud::users::{get_user_with_oauth_id, update_user_with_id, create_new_user, get_user_with_token, get_user_with_id};
use rand::prelude::*;
use sha2::{Digest, Sha256};

// Authentication
#[get("/discord")]
pub async fn get_discord_oauth(query: web::Query<UserOAuthDTO>) -> Result<Redirect, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let inital_response = client
        .post(format!("{}/oauth2/token", get_discord_api_url()))
        .form(&[
            ("client_id", get_env_var("DISCORD_OAUTH_ID")),
            ("client_secret", get_env_var("DISCORD_OAUTH_SECRET")),
            ("code", query.code.to_string()),
            ("grant_type", "authorization_code".to_string()),
            ("redirect_uri", get_local_api_url() + "/users/auth/discord")
        ])
        .header("Content-Type", "application/x-www-form-urlencoded")
        .send()
        .await?;
    let inital_response_parsed: DiscordInitialDTO = serde_json::from_str::<DiscordInitialDTO>(inital_response.text().await?.as_str())?;
    let user_response = client
        .get(format!("{}/users/@me", get_discord_api_url()))
        .header("authorization", format!("{} {}", inital_response_parsed.token_type, inital_response_parsed.access_token))
        .send()
        .await?;
    if user_response.status() != 200 {
        return Ok(Redirect::to(format!("{}/users/login?msg=ue", get_env_var("FRONTEND_URL"))).permanent());
    }

    let user_response_parsed: DiscordUserDTO = serde_json::from_str::<DiscordUserDTO>(user_response.text().await?.as_str())?;
    let connection = &mut create_connection();
    let oauth: String = format!("discord-{}", user_response_parsed.id).to_string();
    let user_option: Option<User> = get_user_with_oauth_id(connection, oauth);
    // Check if a user already exists with OAuth provider
    if user_option.is_some() {
        let user_unwrap = user_option.unwrap();
        let _update = update_user_with_id(connection, user_unwrap.id, NewUser { 
            oauth: user_unwrap.oauth, 
            username: user_response_parsed.global_name, 
            avatar: format!("https://cdn.discordapp.com/avatars/{}/{}", user_response_parsed.id, user_response_parsed.avatar),
            joined: user_unwrap.joined, 
            token: user_unwrap.token.clone(), 
            enrolled_classes: user_unwrap.enrolled_classes, 
            teaching_classes: user_unwrap.teaching_classes 
        });
        return Ok(Redirect::to(format!("{}/users/login?token={}", get_env_var("FRONTEND_URL"), user_unwrap.token)));
    }

    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            user_response_parsed.id,
            random_number * 2_000_000_000f64
        )
        .into_bytes(),
    );
    let user_token: String = format!("{:X}", hasher.finalize()).to_string();
    let new_user = NewUser {
        username: user_response_parsed.global_name,
        joined: iso8601(&SystemTime::now()),
        oauth: format!("discord-{}", user_response_parsed.id),
        avatar: format!("https://cdn.discordapp.com/avatars/{}/{}", user_response_parsed.id, user_response_parsed.avatar),
        token: user_token.clone(),
        enrolled_classes: vec![],
        teaching_classes: vec![]
    };
    let _insert: Option<User> = create_new_user(connection, new_user);
    Ok(Redirect::to(format!("{}/users/login?token={}", get_env_var("FRONTEND_URL"), user_token)).permanent())
}

#[get("/github")]
pub async fn get_github_oauth(query: web::Query<UserOAuthDTO>) -> Result<Redirect, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let initial_token_response = client
        .post("https://github.com/login/oauth/access_token")
        .form(&[
            ("code", query.code.to_owned()),
            ("client_id", get_env_var("GITHUB_OAUTH_ID")),
            ("client_secret", get_env_var("GITHUB_OAUTH_SECRET")),
        ])
        .header("accept", "application/json")
        .send()
        .await?;
    let initial_response_parsed: GithubInitialDTO = serde_json::from_str::<GithubInitialDTO>(initial_token_response.text().await?.as_str())?;
    let user_response = client
        .get("https://api.github.com/user")
        .header("authorization", format!("{} {}", initial_response_parsed.token_type, initial_response_parsed.access_token))
        .header("accept", "application/vnd.github+json")
        .header("user-agent", "request")
        .send()
        .await?;
    if user_response.status() != 200 {
        return Ok(Redirect::to(format!("{}/users/login?msg=ue", get_env_var("FRONTEND_URL"))).permanent());
    }
    let user_response_parsed: GithubUserDTO = serde_json::from_str::<GithubUserDTO>(user_response.text().await?.as_str())?;
    let oauth = format!("github-{}", user_response_parsed.id);
    let connection = &mut create_connection();
    let user: Option<User> = get_user_with_oauth_id(connection, oauth);

    if user.is_some() {
        let user_unwrap = user.unwrap();
        let _update = update_user_with_id(connection, user_unwrap.id, NewUser {
            oauth: user_unwrap.oauth, 
            username: user_response_parsed.login, 
            avatar: user_response_parsed.avatar_url,
            joined: user_unwrap.joined, 
            token: user_unwrap.token.clone(), 
            enrolled_classes: user_unwrap.enrolled_classes, 
            teaching_classes: user_unwrap.teaching_classes 
        });
        return Ok(Redirect::to(format!("{}/users/login?token={}", get_env_var("FRONTEND_URL"), user_unwrap.token)));
    }

    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen();
    let mut hasher = Sha256::new();
    hasher.update(
        format!(
            "{}{}",
            user_response_parsed.id,
            random_number * 2_000_000_000f64
        )
        .into_bytes(),
    );
    let user_token: String = format!("{:X}", hasher.finalize()).to_string();
    let new_user = NewUser {
        username: user_response_parsed.login,
        oauth: format!("github-{}", user_response_parsed.id),
        joined: iso8601(&SystemTime::now()),
        avatar: user_response_parsed.avatar_url,
        token: user_token.clone(),
        enrolled_classes: vec![],
        teaching_classes: vec![]
    };
    let _insert = create_new_user(connection, new_user);
    Ok(Redirect::to(format!("{}/users/login?token={}", get_env_var("FRONTEND_URL"), user_token)))
}

#[get("/google")]
pub async fn get_google_oauth(query: web::Query<UserOAuthDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let initial_response = client
        .post(format!("https://oauth2.googleapis.com/token"))
        .form(&[
            ("code", query.code.clone()),
            ("client_id", get_env_var("GOOGLE_OAUTH_ID")),
            ("client_secret", get_env_var("GOOGLE_OAUTH_SECRET")),
            ("redirect_uri", format!("{}/users/auth/google", get_local_api_url())),
            ("grant_type", "authorization_code".to_string())
        ])
        .header("Content-Type", "application/x-www-form-urlencoded")    
        .send()
        .await?;
    let _initial_response_parsed: GoogleInitialDTO = serde_json::from_str(initial_response.text().await?.as_str())?;

    Ok(HttpResponse::Ok())
}

// User Information
#[get("")]
pub async fn get_user_information(request: HttpRequest) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }

    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap());
    match user_option {
        Some(user) => {
            Ok(HttpResponse::Ok().json(UserResponseMessage { message: "Fetched user".to_string(), user }))            
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}

#[get("/id")]
pub async fn get_user_information_from_id(query: web::Query<GetUserDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_id(connection, query.user_id);
    match user_option {
        Some(mut user) => {
            user.token = "".to_string();
            Ok(HttpResponse::Ok().json(GetUserMessage { message: "Fetched user".to_string(), user }))
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
