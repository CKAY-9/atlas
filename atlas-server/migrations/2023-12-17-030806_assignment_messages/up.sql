CREATE TABLE assignment_messages (
  id SERIAL NOT NULL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  posted TEXT NOT NULL,
  assignment_id INTEGER NOT NULL
);
