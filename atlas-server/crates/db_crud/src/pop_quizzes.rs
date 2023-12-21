use atlas_db_schema::{models::{PopQuiz, NewPopQuiz}, schema::pop_quizzes};
use diesel::{PgConnection, RunQueryDsl, QueryDsl, ExpressionMethods};

pub fn create_new_pop_quiz(connection: &mut PgConnection, pop_quiz: NewPopQuiz) -> Option<PopQuiz> {
    let insert_result = diesel::insert_into(pop_quizzes::table)
        .values(pop_quiz)
        .get_result::<PopQuiz>(connection);
    match insert_result {
        Ok(insert) => Some(insert),
        _ => None
    }
}

pub fn get_pop_quiz_with_id(connection: &mut PgConnection, pop_quiz_id: i32) -> Option<PopQuiz> {
    let fetch_result = pop_quizzes::table
        .find(pop_quiz_id)
        .first::<PopQuiz>(connection);
    match fetch_result {
        Ok(fetch) => Some(fetch),
        _ => None
    }
}

pub fn update_pop_quiz_with_id(connection: &mut PgConnection, pop_quiz_id: i32, update: NewPopQuiz) -> Option<PopQuiz> {
    let update_result = diesel::update(pop_quizzes::table)
        .filter(pop_quizzes::id.eq(pop_quiz_id))
        .set(update)
        .get_result::<PopQuiz>(connection);
    match update_result {
        Ok(update) => Some(update),
        _ => None
    }
}

pub fn delete_pop_quiz_with_id(connection: &mut PgConnection, pop_quiz_id: i32) -> bool {
    let delete_result = diesel::delete(pop_quizzes::table)
        .filter(pop_quizzes::id.eq(pop_quiz_id))
        .execute(connection);
    delete_result.is_ok()
}
