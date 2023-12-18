use atlas_db_schema::{models::{User, NewUser}, schema::users};
use diesel::{RunQueryDsl, PgConnection, QueryDsl, QueryResult, ExpressionMethods};

pub fn get_user_with_token(connection: &mut PgConnection, token: String) -> Option<User> {
    let user: QueryResult<User> = users::table
        .filter(users::token.eq(token)) 
        .first::<User>(connection);
    match user {
        Ok(u) => {
            Some(u) 
        },
        Err(_e) => {
            None
        }
    }
}

pub fn delete_user_with_id(connection: &mut PgConnection, user_id: i32) -> bool {
    let delete_result = diesel::delete(users::table)
        .filter(users::id.eq(user_id))
        .execute(connection);
    delete_result.is_ok()
}

pub fn get_user_with_id(connection: &mut PgConnection, id: i32) -> Option<User> {
    let user: QueryResult<User> = users::table
        .find(id)
        .first::<User>(connection);
    match user {
        Ok(u) => {
            Some(u)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn get_user_with_oauth_id(connection: &mut PgConnection, oauth: String) -> Option<User> {
    let user: QueryResult<User> = users::table
        .filter(users::oauth.eq(oauth))
        .first::<User>(connection);
    match user {
        Ok(u) => {
            Some(u)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn update_user_with_id(connection: &mut PgConnection, id: i32, update: NewUser) -> Option<User> {
    let user_update = diesel::update(users::table)
        .filter(users::id.eq(id))
        .set(update)
        .get_result::<User>(connection);
    match user_update {
        Ok(u) => {
            Some(u)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn create_new_user(connection: &mut PgConnection, user: NewUser) -> Option<User> {
    let insert = diesel::insert_into(users::table)
        .values(user)
        .get_result::<User>(connection);
    match insert {
        Ok(u) => {
            Some(u)
        },
        Err(_e) => {
            None
        }
    }
}
