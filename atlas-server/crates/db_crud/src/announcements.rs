use atlas_db_schema::{models::{NewAnnouncement, Announcement}, schema::announcements};
use diesel::{PgConnection, RunQueryDsl, QueryResult, QueryDsl};

pub fn create_new_announcement(connection: &mut PgConnection, new_announcement: NewAnnouncement) -> Option<Announcement> {
    let insert_result = diesel::insert_into(announcements::table)
        .values(new_announcement)
        .get_result::<Announcement>(connection);
    match insert_result {
        Ok(insert) => {
            Some(insert)
        },
        Err(_e) => {
            None
        }
    }
}

pub fn get_announcement_with_id(connection: &mut PgConnection, announcement_id: i32) -> Option<Announcement> {
    let fetch_result: QueryResult<Announcement> = announcements::table
        .find(announcement_id)
        .first::<Announcement>(connection);
    match fetch_result {
        Ok(fetch) => {
            Some(fetch)
        },
        Err(_e) => {
            None
        }
    }
}
