use atlas_db_schema::{models::{NewAssignment, Assignment}, schema::assignments};
use diesel::{PgConnection, RunQueryDsl, QueryResult, QueryDsl, ExpressionMethods};

pub fn create_new_assignment(connection: &mut PgConnection, assignment: NewAssignment) -> Option<Assignment> {
    let insert_result = diesel::insert_into(assignments::table)
        .values(assignment)
        .get_result::<Assignment>(connection);
    match insert_result {
        Ok(insert) => Some(insert),
        _ => None
    }
}

pub fn get_assignment_with_id(connection: &mut PgConnection, assignment_id: i32) -> Option<Assignment> {
    let fetch_result: QueryResult<Assignment> = assignments::table
        .find(assignment_id)
        .first::<Assignment>(connection);
    match fetch_result {
        Ok(fetch) => Some(fetch),
        _ => None
    }
}

pub fn update_assignment_with_id(connection: &mut PgConnection, assignment_id: i32, update: NewAssignment) -> Option<Assignment> {
    let update_result = diesel::update(assignments::table)
        .filter(assignments::id.eq(assignment_id))
        .set(update)
        .get_result::<Assignment>(connection);
    match update_result {
        Ok(update) => Some(update),
        _ => None
    }
}

pub fn delete_assignment_with_id(connection: &mut PgConnection, assignment_id: i32) -> bool {
    let delete_result = diesel::delete(assignments::table)
        .filter(assignments::id.eq(assignment_id))
        .execute(connection);
    delete_result.is_ok()
}
