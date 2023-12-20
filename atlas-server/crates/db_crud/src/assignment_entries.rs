use atlas_db_schema::{models::{NewAssignmentEntry, AssignmentEntry}, schema::assignment_entries};
use diesel::{PgConnection, RunQueryDsl, ExpressionMethods, QueryDsl};

pub fn create_new_assignment_entry(connection: &mut PgConnection, entry: NewAssignmentEntry) -> Option<AssignmentEntry> {
    let insert_result = diesel::insert_into(assignment_entries::table)
        .values(entry)
        .get_result::<AssignmentEntry>(connection);
    match insert_result {
        Ok(insert) => Some(insert),
        _ => None
    }
}

pub fn get_assignment_entry_with_id(connection: &mut PgConnection, assignment_entry_id: i32) -> Option<AssignmentEntry> {
    let fetch_result = assignment_entries::table
        .find(assignment_entry_id)
        .first::<AssignmentEntry>(connection);
    match fetch_result {
        Ok(fetch) => Some(fetch),
        _ => None
    }
}

pub fn update_assignment_entry_with_id(connection: &mut PgConnection, entry_id: i32, update: NewAssignmentEntry) -> Option<AssignmentEntry> {
    let update_result = diesel::update(assignment_entries::table)
        .filter(assignment_entries::id.eq(entry_id))
        .set(update)
        .get_result::<AssignmentEntry>(connection);
    match update_result {
        Ok(update) => Some(update),
        _ => None
    }
}

pub fn delete_assignment_entry_with_id(connection: &mut PgConnection, entry_id: i32) -> bool {
    let delete_result = diesel::delete(assignment_entries::table)
        .filter(assignment_entries::id.eq(entry_id))
        .execute(connection);
    delete_result.is_ok()
}
