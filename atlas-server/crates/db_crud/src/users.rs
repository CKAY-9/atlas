use atlas_db_schema::{models::{User, NewUser}, schema::users};
use diesel::{RunQueryDsl, PgConnection, QueryDsl, QueryResult, ExpressionMethods};

pub fn get_user_from_token(connection: &mut PgConnection, token: String) -> Option<User> {
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

pub fn get_user_from_id(connection: &mut PgConnection, id: i32) -> Option<User> {
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

pub fn get_user_from_oauth_id(connection: &mut PgConnection, oauth: String) -> Option<User> {
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

pub fn update_user_from_id(connection: &mut PgConnection, id: i32, update: NewUser) -> Option<User> {
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
