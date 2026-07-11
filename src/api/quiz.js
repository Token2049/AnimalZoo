import api from './index'

export const quizApi = {
  getQuestions(params) {
    return api.get('/quiz/questions', { params })
  },

  submitAnswer(data) {
    return api.post('/quiz/answer', data)
  },

  getResult(quizId) {
    return api.get(`/quiz/result/${quizId}`)
  },

  getLeaderboard() {
    return api.get('/quiz/leaderboard')
  }
}

export default quizApi
