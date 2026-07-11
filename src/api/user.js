import api from './index'

export const userApi = {
  getProfile() {
    return api.get('/user/profile')
  },

  updateProfile(data) {
    return api.put('/user/profile', data)
  },

  getAchievements() {
    return api.get('/user/achievements')
  },

  unlockAchievement(achievementId) {
    return api.post(`/user/achievements/${achievementId}`)
  },

  getFavorites() {
    return api.get('/user/favorites')
  },

  addFavorite(animalId) {
    return api.post(`/user/favorites/${animalId}`)
  },

  removeFavorite(animalId) {
    return api.delete(`/user/favorites/${animalId}`)
  }
}

export default userApi
