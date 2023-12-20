use atlas_db_schema::{models::{NewCourseMaterial, CourseMaterial}, schema::course_materials};
use diesel::{PgConnection, RunQueryDsl, QueryDsl, QueryResult, ExpressionMethods};

pub fn create_new_material(connection: &mut PgConnection, new_material: NewCourseMaterial) -> Option<CourseMaterial> {
    let insert_result = diesel::insert_into(course_materials::table)
        .values(new_material)
        .get_result::<CourseMaterial>(connection);
    match insert_result {
        Ok(insert) => Some(insert),
        Err(_) => None
    }
}

pub fn get_material_with_id(connection: &mut PgConnection, course_material_id: i32) -> Option<CourseMaterial> {
    let fetch_result: QueryResult<CourseMaterial> = course_materials::table
        .find(course_material_id)
        .first::<CourseMaterial>(connection);
    match fetch_result {
        Ok(fetch) => Some(fetch),
        _ => None
    }
}

pub fn update_material_with_id(connection: &mut PgConnection, course_material_id: i32, update: NewCourseMaterial) -> Option<CourseMaterial> {
    let update_result = diesel::update(course_materials::table)
        .filter(course_materials::id.eq(course_material_id))
        .set(update)
        .get_result::<CourseMaterial>(connection);
    match update_result {
        Ok(update) => Some(update),
        _ => None
    }
}

pub fn delete_material_with_id(connection: &mut PgConnection, course_material_id: i32) -> bool {
    let delete_result = diesel::delete(course_materials::table)
        .filter(course_materials::id.eq(course_material_id))
        .execute(connection);
    delete_result.is_ok()
}
