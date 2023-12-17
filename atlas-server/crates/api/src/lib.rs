use actix_web::web;
use atlas_api_routes::users::get::{get_discord_oauth, get_google_oauth, get_github_oauth};

pub fn configure_api_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .service(
                web::scope("/users") // Users API
                   .service(
                        web::scope("/auth")
                            .service(get_discord_oauth)
                            .service(get_google_oauth)
                            .service(get_github_oauth)
                    )
            )
            .service(
                web::scope("/classrooms")
            )
            .service(
                web::scope("/announcments")
            )
    );
}
