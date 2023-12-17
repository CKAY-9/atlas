CREATE TABLE course_units (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  classroom_id INTEGER NOT NULL,
  assignment_ids INTEGER[] NOT NULL
);
