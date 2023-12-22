use std::{time::{SystemTime, UNIX_EPOCH}, fs, io::Write};
use futures::StreamExt;
use actix_web::{post, web, Responder, HttpRequest, HttpResponse};
use actix_multipart::Multipart;

use crate::dto::Message;

#[post("/upload")]
pub async fn upload_file(request: HttpRequest, bytes: web::Payload) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let mut multipart = Multipart::new(
        request.headers(),
        bytes
    );

    let name_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Failed to get time")
        .as_micros();

    let uploaded_name = format!("{:?}", name_time);
    let mut upload_file = fs::File::create(format!("uploads/{}", uploaded_name))?;

    while let Some(chunk) = multipart.next().await {
        let mut chunk = chunk?;
        for chunk_content in chunk.next().await {
            let content = chunk_content.ok().unwrap_or_default();
            upload_file.write(&content)?;
        }
    }

    Ok(HttpResponse::Ok().json(Message { message: format!("{}", uploaded_name).to_string() }))
}
