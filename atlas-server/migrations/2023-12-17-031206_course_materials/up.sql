CREATE TABLE course_materials (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id INTEGER NOT NULL,
  classroom_id INTEGER NOT NULL,
  posted TEXT NOT NULL,
  unit_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  attachments TEXT[] NOT NULL
);
