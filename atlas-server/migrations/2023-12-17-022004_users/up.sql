CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  oauth TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  joined TEXT NOT NULL,
  token TEXT NOT NULL,
  enrolled_classes INTEGER[] NOT NULL,
  teaching_classes INTEGER[] NOT NULL
);
