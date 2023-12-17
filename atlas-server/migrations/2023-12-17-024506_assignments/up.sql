CREATE TABLE assignments (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  classroom_id INTEGER NOT NULL,
  unit_id INTEGER NOT NULL,
  posted TEXT NOT NULL,
  rubric_id INTEGER NOT NULL,
  deadline TEXT NOT NULL,
  attachments TEXT[] NOT NULL
);
