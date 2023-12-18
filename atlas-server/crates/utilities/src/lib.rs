use chrono::prelude::{DateTime, Utc};
use std::env;
use actix_web::HttpRequest;
use rand::{distributions::Alphanumeric, Rng};

pub fn get_env_var(key: &str) -> String {
    let env_var: String = env::var(key).unwrap_or_else(|e| {
        println!("{}", e);
        "".to_owned()
    });
    env_var
}

pub fn get_discord_api_url() -> String {
    "https://discord.com/api/v10".to_string()
}

pub fn get_local_api_url() -> String {
    let api: String = get_env_var("LOCAL_URL") + "/api/v1";
    api
}

pub fn iso8601(st: &std::time::SystemTime) -> String {
    let dt: DateTime<Utc> = st.clone().into();
    format!("{}", dt.format("%+"))
}

pub fn extract_header_value(request: &HttpRequest, key: &str) -> Option<String> {
    let headers = request.headers();
    let val = headers.get(key);
    if val.is_some() {
        let value = val.unwrap().to_str().unwrap().to_string();
        return Some(value);
    }
    None
}

pub fn generate_random_string(length: usize) -> String {
    let s: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(length)
        .map(char::from)
        .collect();
    s
}
