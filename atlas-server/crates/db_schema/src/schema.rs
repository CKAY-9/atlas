// @generated automatically by Diesel CLI.

diesel::table! {
    announcements (id) {
        id -> Int4,
        sender_id -> Int4,
        classroom_id -> Int4,
        content -> Text,
        posted -> Text,
        seen_by -> Array<Int4>,
    }
}

diesel::table! {
    assignment_entries (id) {
        id -> Int4,
        student_id -> Int4,
        assignment_id -> Int4,
        grade -> Float4,
        submitted -> Text,
        attachments -> Array<Text>,
    }
}

diesel::table! {
    assignment_messages (id) {
        id -> Int4,
        sender_id -> Int4,
        receiver_id -> Int4,
        content -> Text,
        posted -> Text,
        assignment_id -> Int4,
    }
}

diesel::table! {
    assignments (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        classroom_id -> Int4,
        unit_id -> Int4,
        posted -> Text,
        teacher_id -> Int4,
        rubric_id -> Int4,
        deadline -> Text,
        attachments -> Array<Text>,
    }
}

diesel::table! {
    classrooms (id) {
        id -> Int4,
        banner -> Text,
        name -> Text,
        code -> Text,
        description -> Text,
        student_ids -> Array<Int4>,
        teacher_ids -> Array<Int4>,
        assignment_ids -> Array<Int4>,
        announcement_ids -> Array<Int4>,
    }
}

diesel::table! {
    course_materials (id) {
        id -> Int4,
        name -> Text,
        teacher_id -> Int4,
        posted -> Text,
        unit_id -> Int4,
        content -> Text,
        attachments -> Array<Text>,
    }
}

diesel::table! {
    course_units (id) {
        id -> Int4,
        name -> Text,
        description -> Text,
        classroom_id -> Int4,
        assignment_ids -> Array<Int4>,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        oauth -> Text,
        username -> Text,
        avatar -> Text,
        joined -> Text,
        token -> Text,
        enrolled_classes -> Array<Int4>,
        teaching_classes -> Array<Int4>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    announcements,
    assignment_entries,
    assignment_messages,
    assignments,
    classrooms,
    course_materials,
    course_units,
    users,
);
