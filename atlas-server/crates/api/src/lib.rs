use actix_web::web;
use atlas_api_routes::{
    users::get::{
        get_discord_oauth, 
        get_google_oauth, 
        get_github_oauth, 
        get_user_information, 
        get_user_information_from_id, 
    }, 
    classrooms::{
        post::{
            create_a_classroom, 
            join_classroom
        }, 
        get::get_classroom_from_id, put::update_classroom
    }, 
    announcements::{post::create_announcement, get::get_announcement_from_id}
};

pub fn configure_api_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .service(
                web::scope("/users") // Users API
                    .service(get_user_information) 
                    .service(get_user_information_from_id)
                    .service(
                        web::scope("/auth")
                            .service(get_discord_oauth)
                            .service(get_google_oauth)
                            .service(get_github_oauth)
                    )
            )
            .service(
                web::scope("/classrooms") // Classrooms API
                    .service(create_a_classroom)
                    .service(join_classroom)
                    .service(get_classroom_from_id)
                    .service(update_classroom)
            )
            .service(
                web::scope("/announcements") // Announcements API
                    .service(get_announcement_from_id)
                    .service(create_announcement)
            )
    );
}
