use actix_web::{post, HttpRequest, Responder, web, HttpResponse};
use atlas_db::create_connection;
use atlas_db_crud::{users::{get_user_with_token, update_user_with_id}, classrooms::{create_new_classroom, get_classroom_with_code, update_classroom_with_id}};
use atlas_db_schema::models::{User, NewClassroom, NewUser, Classroom};
use atlas_utils::{extract_header_value, generate_random_string};
use reqwest::StatusCode;
use crate::dto::Message;
use super::dto::{NewClassroomDTO, NewClassroomMessage, GetClassroomFromCodeDTO};

#[post("")]
pub async fn create_a_classroom(request: HttpRequest, data: web::Json<NewClassroomDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
    let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(mut user) => {
            let new_classroom = NewClassroom {
                name: data.name.clone(),
                code: generate_random_string(8),
                teacher_ids: vec![user.id],
                student_ids: vec![],
                banner: "".to_string(),
                assignment_ids: vec![],
                description: "No description provided.".to_string(),
                announcement_ids: vec![]
            };
            let insert_option = create_new_classroom(connection, new_classroom);
            if insert_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to create classroom".to_string() }));
            }

            let insert = insert_option.unwrap();
           
            user.teaching_classes.push(insert.id);
            let update_option = update_user_with_id(connection, user.id, NewUser {
                username: user.username,
                teaching_classes: user.teaching_classes,
                enrolled_classes: user.enrolled_classes,
                joined: user.joined,
                avatar: user.avatar,
                oauth: user.oauth,
                token: user.token
            });
            if update_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update user".to_string() }));
            }

            let update = update_option.unwrap();
            Ok(HttpResponse::Ok().json(NewClassroomMessage { message: "Created classroom".to_string(), classroom_id: update.id }))
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}

#[post("/join")]
pub async fn join_classroom(request: HttpRequest, data: web::Json<GetClassroomFromCodeDTO>) -> Result<impl Responder, Box<dyn std::error::Error>> {
     let token = extract_header_value(&request, "Authorization");
    if token.is_none() {
        return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "Failed to get user token".to_string() }));
    }
   
    let connection = &mut create_connection();
    let user_option: Option<User> = get_user_with_token(connection, token.unwrap()) ;
    match user_option {
        Some(mut user) => {
            let classroom_option: Option<Classroom> = get_classroom_with_code(connection, data.classroom_code.clone());
            if classroom_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::NOT_FOUND).json(Message { message: "Failed to get classroom".to_string() }));
            }

            let mut classroom = classroom_option.unwrap();
            if classroom.student_ids.contains(&user.id) || classroom.teacher_ids.contains(&user.id) {
                return Ok(HttpResponse::Ok().status(StatusCode::BAD_REQUEST).json(Message { message: "User already in classroom".to_string() }));
            }

            classroom.student_ids.push(user.id);
            let class_update: NewClassroom = serde_json::from_str::<NewClassroom>(serde_json::to_string(&classroom).unwrap().as_str()).unwrap();
            let class_update_option = update_classroom_with_id(connection, classroom.id, class_update);
            if class_update_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update classroom".to_string() }));
            }

            user.enrolled_classes.push(classroom.id);
            let user_update: NewUser = serde_json::from_str::<NewUser>(serde_json::to_string(&user).unwrap().as_str()).unwrap();
            let user_update_option = update_user_with_id(connection, user.id, user_update);
            if user_update_option.is_none() {
                return Ok(HttpResponse::Ok().status(StatusCode::INTERNAL_SERVER_ERROR).json(Message { message: "Failed to update user".to_string() }));
            }
            
            Ok(HttpResponse::Ok().json(NewClassroomMessage { message: "Joined classroom".to_string(), classroom_id: classroom.id }))
        },
        None => {
            Ok(HttpResponse::Ok().status(StatusCode::UNAUTHORIZED).json(Message { message: "Failed to get user".to_string() }))
        }
    }
}
