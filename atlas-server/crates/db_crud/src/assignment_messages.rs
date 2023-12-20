use atlas_db_schema::{models::{NewAssignmentMessage, AssignmentMessage}, schema::assignment_messages};
use diesel::{PgConnection, RunQueryDsl, QueryResult, QueryDsl, ExpressionMethods};

pub fn create_new_assignment_message(connection: &mut PgConnection, new_message: NewAssignmentMessage) -> Option<AssignmentMessage> {
    let insert_result = diesel::insert_into(assignment_messages::table)
        .values(new_message)
        .get_result::<AssignmentMessage>(connection);
    match insert_result {
        Ok(insert) => Some(insert),
        _ => None
    }
}

pub fn get_assignment_message_with_id(connection: &mut PgConnection, assignment_message_id: i32) -> Option<AssignmentMessage> {
    let fetch_result: QueryResult<AssignmentMessage> = assignment_messages::table
        .find(assignment_message_id)
        .first::<AssignmentMessage>(connection);
    match fetch_result {
        Ok(fetch) => Some(fetch),
        _ => None
    }
}

pub fn update_assignment_message_with_id(connection: &mut PgConnection, assignment_message_id: i32, update: NewAssignmentMessage) -> Option<AssignmentMessage> {
    let update_result = diesel::update(assignment_messages::table)
        .filter(assignment_messages::id.eq(assignment_message_id))
        .set(update)
        .get_result::<AssignmentMessage>(connection);
    match update_result {
        Ok(update) => Some(update),
        _ => None
    }
}

pub fn delete_assignment_message_with_id(connection: &mut PgConnection, assignment_message_id: i32) -> bool {
    let delete_result = diesel::delete(assignment_messages::table)
        .filter(assignment_messages::id.eq(assignment_message_id))
        .execute(connection);
    delete_result.is_ok()
}
