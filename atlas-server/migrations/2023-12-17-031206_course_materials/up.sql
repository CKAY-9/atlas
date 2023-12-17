CREATE TABLE course_materials (
  id SERIAL NOT NULL PRIMARY KEY,
  teacher_id INTEGER NOT NULL,
  posted TEXT NOT NULL,
  unit_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  attachments TEXT[] NOT NULL
);
