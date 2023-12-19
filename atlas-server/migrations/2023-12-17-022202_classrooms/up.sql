CREATE TABLE classrooms (
  id SERIAL NOT NULL PRIMARY KEY,
  banner TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  student_ids INTEGER[] NOT NULL,
  teacher_ids INTEGER[] NOT NULL,
  unit_ids INTEGER[] NOT NULL,
  assignment_ids INTEGER[] NOT NULL,
  announcement_ids INTEGER[] NOT NULL
);
