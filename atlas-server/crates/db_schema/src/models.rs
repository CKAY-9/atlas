use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub oauth: String,
    pub username: String,
    pub avatar: String,
    pub joined: String,
    pub token: String,
    pub enrolled_classes: Vec<i32>,
    pub teaching_classes: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub oauth: String,
    pub username: String,
    pub avatar: String,
    pub joined: String,
    pub token: String,
    pub enrolled_classes: Vec<i32>,
    pub teaching_classes: Vec<i32>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::course_units)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct CourseUnit {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub classroom_id: i32,
    pub assignment_ids: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize)]
#[diesel(table_name = crate::schema::course_units)]
pub struct NewCourseUnit {
    pub name: String,
    pub description: String,
    pub classroom_id: i32,
    pub assignment_ids: Vec<i32>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::course_materials)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct CourseMaterial {
    pub id: i32,
    pub name: String,
    pub teacher_id: i32,
    pub classroom_id: i32,
    pub posted: String,
    pub unit_id: i32,
    pub content: String,
    pub attachments: Vec<String>
}

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::course_materials)]
pub struct NewCourseMaterial {
    pub name: String,
    pub teacher_id: i32,
    pub classroom_id: i32,
    pub posted: String,
    pub unit_id: i32,
    pub content: String,
    pub attachments: Vec<String>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::classrooms)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Classroom {
    pub id: i32,
    pub banner: String,
    pub name: String,
    pub code: String,
    pub description: String,
    pub student_ids: Vec<i32>,
    pub teacher_ids: Vec<i32>,
    pub unit_ids: Vec<i32>,
    pub assignment_ids: Vec<i32>,
    pub announcement_ids: Vec<i32>
}

#[derive(Insertable, AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::classrooms)]
pub struct NewClassroom {
    pub banner: String,
    pub name: String,
    pub code: String,
    pub description: String,
    pub student_ids: Vec<i32>,
    pub teacher_ids: Vec<i32>,
    pub unit_ids: Vec<i32>,
    pub assignment_ids: Vec<i32>,
    pub announcement_ids: Vec<i32>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::assignments)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Assignment {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub classroom_id: i32,
    pub unit_id: i32,
    pub posted: String,
    pub teacher_id: i32,
    pub rubric_id: i32,
    pub deadline: String,
    pub attachments: Vec<String>
}

#[derive(Insertable, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::assignments)]
pub struct NewAssignment {
    pub name: String,
    pub description: String,
    pub classroom_id: i32,
    pub unit_id: i32,
    pub posted: String,
    pub teacher_id: i32,
    pub rubric_id: i32,
    pub deadline: String,
    pub attachments: Vec<String>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::assignment_messages)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AssignmentMessage {
    pub id: i32,
    pub sender_id: i32,
    pub receiver_id: i32,
    pub content: String,
    pub posted: String,
    pub assignment_id: i32
}

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::assignment_messages)]
pub struct NewAssignmentMessage {
    pub sender_id: i32,
    pub receiver_id: i32,
    pub content: String,
    pub posted: String,
    pub assignment_id: i32
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::assignment_entries)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AssignmentEntry {
    pub id: i32,
    pub student_id: i32,
    pub assignment_id: i32,
    pub grade: f32,
    pub submitted: String,
    pub turned_in: bool,
    pub attachments: Vec<String>
}

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::assignment_entries)]
pub struct NewAssignmentEntry {
    pub student_id: i32,
    pub assignment_id: i32,
    pub grade: f32,
    pub submitted: String,
    pub turned_in: bool,
    pub attachments: Vec<String>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::announcements)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Announcement {
    pub id: i32,
    pub sender_id: i32,
    pub classroom_id: i32,
    pub content: String,
    pub posted: String,
    pub seen_by: Vec<i32>
}

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::announcements)]
pub struct NewAnnouncement {
    pub sender_id: i32,
    pub classroom_id: i32,
    pub content: String,
    pub posted: String,
    pub seen_by: Vec<i32>
}

#[derive(Queryable, Selectable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::pop_quizzes)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct PopQuiz {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub creator: i32,
    pub posted: String,
    pub questions: Vec<String>
}

#[derive(Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::pop_quizzes)]
pub struct NewPopQuiz {
    pub name: String,
    pub description: String,
    pub creator: i32,
    pub posted: String,
    pub questions: Vec<String>
}
