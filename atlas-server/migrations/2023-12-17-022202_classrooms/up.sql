CREATE TABLE classrooms (
  id SERIAL NOT NULL PRIMARY KEY,
  banner TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  student_ids INTEGER[] NOT NULL,
  teacher_ids INTEGER[] NOT NULL,
  assignment_ids INTEGER[] NOT NULL,
  announcment_ids INTEGER[] NOT NULL
);