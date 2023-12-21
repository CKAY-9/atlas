CREATE TABLE pop_quizzes (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  creator INTEGER NOT NULL,
  posted TEXT NOT NULL,
  questions TEXT[] NOT NULL -- JSON 
);
