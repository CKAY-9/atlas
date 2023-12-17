CREATE TABLE assignment_entries (
  id SERIAL NOT NULL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  assignment_id INTEGER NOT NULL,
  grade REAL NOT NULL,
  submitted TEXT NOT NULL,
  attachments TEXT[] NOT NULL
);
