use atlas_db_schema::{models::{NewCourseUnit, CourseUnit}, schema::course_units};
use diesel::{PgConnection, RunQueryDsl, QueryDsl, ExpressionMethods};

pub fn create_new_unit(connection: &mut PgConnection, unit: NewCourseUnit) -> Option<CourseUnit> {
    let insert_result = diesel::insert_into(course_units::table)
        .values(unit)
        .get_result::<CourseUnit>(connection);
    match insert_result {
        Ok(insert) => Some(insert),
        _ => None
    }
}

pub fn get_unit_with_id(connection: &mut PgConnection, unit_id: i32) -> Option<CourseUnit> {
    let fetch_result = course_units::table
        .find(unit_id)
        .first::<CourseUnit>(connection);
    match fetch_result { 
        Ok(fetch) => Some(fetch),
        _ => None
    }
}

pub fn update_unit_with_id(connection: &mut PgConnection, unit_id: i32, unit: NewCourseUnit) -> Option<CourseUnit> {
    let update_result = diesel::update(course_units::table)
        .filter(course_units::id.eq(unit_id))
        .set(unit)
        .get_result::<CourseUnit>(connection);
    match update_result {
        Ok(update) => Some(update),
        _ => None
    }
}

pub fn delete_unit_with_id(connection: &mut PgConnection, unit_id: i32) -> bool {
    let delete_result = diesel::delete(course_units::table)
        .filter(course_units::id.eq(unit_id))
        .execute(connection);
    delete_result.is_ok()
}
