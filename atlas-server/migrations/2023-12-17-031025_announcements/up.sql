CREATE TABLE announcements (
  id SERIAL NOT NULL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  classroom_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  posted TEXT NOT NULL,
  seen_by INTEGER[] NOT NULL
);
