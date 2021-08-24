/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  const res = {
    ...question
  };
  delete res.answers;
  return res;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  return question.answers
}

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.i
*/
export const quizQuestionGetAnswers = question => {
  return question.options.map((_, idx) => idx); 
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.duration + 2;
};
