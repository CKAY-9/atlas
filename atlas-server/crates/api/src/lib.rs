use actix_web::web;
use atlas_api_routes::{
    users::{
        get::{
            get_discord_oauth, 
            get_google_oauth, 
            get_github_oauth, 
            get_user_information, 
            get_user_information_from_id, 
        },
        delete::delete_user
    }, 
    classrooms::{
        post::{
            create_a_classroom, 
            join_classroom
        }, 
        get::get_classroom_from_id, 
        put::update_classroom, 
        delete::delete_classroom
    }, 
    announcements::{
        get::get_announcement_from_id, 
        post::create_announcement, 
        delete::delete_announcement
    }, 
    assignments::{
        get::get_assignment, 
        post::create_assignment
    }, 
    course_units::{
        get::get_unit, 
        post::create_course_unit, 
        delete::delete_unit
    }, 
    course_materials::{
        get::get_material, 
        post::create_course_material, 
        delete::delete_material
    }, 
    assignment_entries::{
        get::{
            get_assignment_entry, 
            get_assignment_entry_for_student
        }, 
        post::new_assignment_entry,
        put::update_assignment_entry
    }, 
    pop_quizzes::{
        post::new_pop_quiz, 
        get::get_pop_quiz
    }, 
    files::post::upload_file, 
};

pub fn configure_api_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .service(
                web::scope("/users") // Users API
                    .service(get_user_information) 
                    .service(get_user_information_from_id)
                    .service(delete_user)
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
                    .service(delete_classroom)
            )
            .service(
                web::scope("/announcements") // Announcements API
                    .service(get_announcement_from_id)
                    .service(create_announcement)
                    .service(delete_announcement)
            )
            .service(
                web::scope("/assignments") // Assignments API
                    .service(get_assignment)
                    .service(create_assignment)
            )
            .service(
                web::scope("/units") // Course Units API
                    .service(get_unit)
                    .service(create_course_unit)
                    .service(delete_unit)
            )
            .service(
                web::scope("/materials") // Course Materials API
                    .service(get_material)
                    .service(create_course_material)
                    .service(delete_material)
            )
            .service(
                web::scope("/entries") // Assignment Entries API
                    .service(get_assignment_entry)
                    .service(get_assignment_entry_for_student)
                    .service(new_assignment_entry)
                    .service(update_assignment_entry)
            )
            .service(
                web::scope("/quizzes") // Pop Quizzes API
                    .service(new_pop_quiz)
                    .service(get_pop_quiz)
            )
            .service(
                web::scope("/files") // Files API
                    .service(upload_file)
            )
    );
}
