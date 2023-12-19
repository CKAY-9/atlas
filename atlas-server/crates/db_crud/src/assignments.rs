use atlas_db_schema::{models::{NewAssignment, Assignment}, schema::assignments};
use diesel::{PgConnection, RunQueryDsl, QueryResult, QueryDsl};

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
