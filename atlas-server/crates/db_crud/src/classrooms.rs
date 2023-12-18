use atlas_db_schema::{models::{NewClassroom, Classroom}, schema::classrooms};
use diesel::{PgConnection, RunQueryDsl, QueryDsl, QueryResult, ExpressionMethods};

pub fn get_classroom_with_code(connection: &mut PgConnection, classroom_code: String) -> Option<Classroom> {
    let fetch_result: QueryResult<Classroom> = classrooms::table
        .filter(classrooms::code.eq(classroom_code))
        .first::<Classroom>(connection);
    match fetch_result {
        Ok(fetch) => {
            Some(fetch)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn get_classroom_with_id(connection: &mut PgConnection, classroom_id: i32) -> Option<Classroom> {
    let fetch_result: QueryResult<Classroom> = classrooms::table
        .find(classroom_id)
        .first::<Classroom>(connection);
    match fetch_result {
        Ok(fetch) => {
            Some(fetch)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn create_new_classroom(connection: &mut PgConnection, classroom: NewClassroom) -> Option<Classroom> {
    let insert_result = diesel::insert_into(classrooms::table)
        .values(classroom)
        .get_result::<Classroom>(connection);
    match insert_result {
        Ok(insert) => {
            Some(insert)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn update_classroom_with_id(connection: &mut PgConnection, id: i32, update: NewClassroom) -> Option<Classroom> {
    let update_result = diesel::update(classrooms::table)
        .filter(classrooms::id.eq(id))
        .set(update)
        .get_result::<Classroom>(connection);
    match update_result {
        Ok(result) => {
            Some(result)
        },
        Err(_e) => {
            None
        }
    }
}
