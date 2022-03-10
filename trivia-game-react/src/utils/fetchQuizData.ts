export const fetchQuizData = () =>
  fetch(
    `https://opentdb.com/api.php?amount=3&difficulty=hard&type=boolean`,
  ).then(response => response.json())
