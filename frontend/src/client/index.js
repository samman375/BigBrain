import config from '../config.json';

const BASE_URL = `http://localhost:${config.BACKEND_PORT}/`;

/**
 * Makes a fetch api request
 * @param {String} method - eg. PUT, GET, etc.
 * @param {String} url
 * @param {Object} params - eg. headers, body
 * @returns {Promise<object>} respBody
 */
const request = async (method, url, params) => {
  const resp = await fetch(BASE_URL + url, {
    headers: {
      'content-type': 'application/json',
      ...params.headers,
    },
    body: JSON.stringify(params.data),
    method: method
  });
  const respBody = await resp.json();
  if (!resp.ok) {
    throw new Error(respBody.error);
  } else {
    return respBody;
  }
};

/**
 * Sends a post request
 * @param {string} url
 * @param {object} params
 * @param {object} params.headers
 * @param {object} params.data
 * @returns {Promise<object>} respBody - returned response object
 */
const postRequest = async (url, params) => {
  return await request('POST', url, params);
};

/**
 * Sends a put request
 * @param {string} url
 * @param {object} params
 * @param {object} params.headers
 * @param {object} params.data
 * @returns {Promise<object>} respBody - returned response object
 */
const putRequest = async (url, params) => {
  return await request('PUT', url, params);
};

/**
 * Sends a get request
 * @param {string} url
 * @param {object} params
 * @param {object} params.headers
 * @param {object} params.data
 * @returns {Promise<object>} respBody - returned response object
 */
const getRequest = async (url, params) => {
  return await request('GET', url, params);
};

/**
 * Sends a delete request
 * @param {string} url
 * @param {object} params
 * @param {object} params.headers
 * @param {object} params.data
 * @returns {Promise<object>} respBody - returned response object
 */
const deleteRequest = async (url, params) => {
  return await request('DELETE', url, params);
}

/**
 * Data to be used in login fetch request from Login.jsx
 * Passed to postRequest()
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} respBody - returned response object
 */
export const login = async (email, password) => {
  const requestBody = { email, password };
  const resp = await postRequest('admin/auth/login', { data: requestBody });
  return resp;
};

/**
 * Data to be used in register fetch request from Register.jsx
 * Passed to postRequest()
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<object>} respBody - returned response object
 */
export const register = async (email, password, name) => {
  const requestBody = { email, password, name };
  const resp = await postRequest('admin/auth/register', { data: requestBody });
  return resp;
};

/**
 * Data to be used in logout fetch request from NavBar.jsx
 * Passed to postRequest()
 * @param {string} token
 * @returns {Promise<object>} respBody - returned response object
 */
const logout = async (token) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await postRequest('admin/auth/logout', {
    headers: authHeader
  });
  return resp;
};

/**
 * Data to be used in admin quiz fetch request from Dashboard.jsx
 * Calls fetchQuestions and adds to list of quizzes
 * @param {string} token
 * @returns {Promise<object>} respBody - returned response object
 */
export const getQuizList = async (token) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await getRequest('admin/quiz', {
    headers: authHeader
  });
  const promises = resp.quizzes.map(quiz => fetchQuestions(token, quiz.id))
  const quizzes = await Promise.all(promises);
  const quizzesWithQuestions = { ...resp };
  quizzes.forEach((quiz, idx) => {
    quizzesWithQuestions.quizzes[idx] = {
      ...(quizzesWithQuestions.quizzes[idx]),
      questions: quiz.questions
    }
  });
  return quizzesWithQuestions;
};

/**
 * Returns quiz information for given quiz
 * @param {String} token
 * @param {Number} quizId
 * @returns {Promise<object>} respBody - returned response object
 */
export const fetchQuestions = async (token, quizId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await getRequest(`admin/quiz/${quizId}`, {
    headers: authHeader
  });
  return resp;
};

export const updateQuiz = async (token, quizId, params) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await putRequest(`admin/quiz/${quizId}`, {
    headers: authHeader,
    data: params
  });
  return resp;
};

/**
 * Makes fetch request to delete given quiz
 * @param {String} token
 * @param {Number} quizId
 * @returns {Promise<object>} respBody - returned response object
 */
const deleteQuizRequest = async (token, quizId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await deleteRequest(`admin/quiz/${quizId}`, {
    headers: authHeader
  });
  return resp;
};

/**
 * Makes fetch request to create new quiz
 * @param {String} token
 * @param {String} name - name of quiz
 * @returns {Promise<object>} respBody - returned response object
 */
export const createQuizRequest = async (token, name) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const requestBody = { name };
  const resp = await postRequest('admin/quiz/new', {
    headers: authHeader,
    data: requestBody
  });
  return resp;
};

/**
 * Makes fetch request to start a game
 * @param {String} token
 * @param {Number} quizId
 * @returns {Promise<object>} respBody - returned response object
 */
const startGameRequest = async (token, quizId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await postRequest(`admin/quiz/${quizId}/start`, {
    headers: authHeader
  });
  return resp;
};

/**
 * Makes fetch request to end a game
 * @param {String} token
 * @param {Number} quizId
 * @returns {Promise<object>} respBody - returned response object
 */
const endGameRequest = async (token, quizId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await postRequest(`admin/quiz/${quizId}/end`, {
    headers: authHeader
  });
  return resp;
};

/**
 * Get session results
 * @param {string} token
 * @param {sessionId} sessionId
 * @returns {Promise<object>}
 **/
export const fetchSessionResults = async (token, sessionId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await getRequest(`admin/session/${sessionId}/results`, {
    headers: authHeader,
  })
  return resp.results
}

export const joinGame = async (sessionId, playerName) => {
  const resp = await postRequest(`play/join/${sessionId}`, {
    data: {
      name: playerName
    }
  })
  return resp;
}

export const fetchPlayerCurrentQuestion = async (playerId) => {
  const resp = await getRequest(`play/${playerId}/question`, {
    headers: { }
  });
  return resp;
}

export const fetchPlayerResult = async (playerId) => {
  const resp = await getRequest(`play/${playerId}/results`, {
    headers: { }
  })
  return resp;
}

export const fetchSessionStatus = async (token, sessionId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await getRequest(`admin/session/${sessionId}/status`, {
    headers: authHeader
  });
  return resp;
}
/**
 * Makes fetch request to get question data for a given question
 * @param {Number} playerId
 * @returns {Promise<object>} respBody - returned response object
 */
const getQuestion = async (playerId) => {
  const resp = await getRequest(`play/${playerId}/question`, {});
  return resp;
}

/**
 * Makes fetch request to get correct answer for a given question
 * @param {Number} playerId
 * @returns {Promise<object>} respBody - returned response object
 */
const getCorrectAnswer = async (playerId) => {
  const resp = await getRequest(`play/${playerId}/answer`, {});
  return resp;
}

/**
 * Makes fetch request to submit selected answers for a given question
 * @param {Number} playerId
 * @param {Array} answerIds - list of all selected answerIds
 * @returns {Promise<object>} respBody - returned response object
 */
const submitAnswer = async (playerId, answerIds) => {
  const params = { answerIds: answerIds }
  const resp = await putRequest(`play/${playerId}/answer`, {
    data: params
  });
  return resp;
}

/**
 * Makes fetch request to advance game
 * @param {String} token
 * @param {Number} quizId
 * @returns {Promise<object>} respBody - returned response object
 */
const advanceGame = async (token, quizId) => {
  const authHeader = {
    Authorization: 'Bearer ' + token
  };
  const resp = await postRequest(`admin/quiz/${quizId}/advance`, {
    headers: authHeader
  });
  return resp;
}

export default {
  login,
  logout,
  register,
  fetchQuestions,
  updateQuiz,
  getQuizList,
  deleteQuizRequest,
  createQuizRequest,
  fetchSessionResults,
  fetchSessionStatus,
  startGameRequest,
  endGameRequest,
  getQuestion,
  submitAnswer,
  getCorrectAnswer,
  advanceGame,
};
