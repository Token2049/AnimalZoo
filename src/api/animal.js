import api from './index'

export const animalApi = {
  getList(params) {
    return api.get('/animals', { params })
  },

  getById(id) {
    return api.get(`/animals/${id}`)
  },

  search(keyword) {
    return api.get('/animals/search', { params: { keyword } })
  },

  getByCategory(category) {
    return api.get('/animals/category', { params: { category } })
  },

  getGallery(id) {
    return api.get(`/animals/${id}/gallery`)
  }
}

export default animalApi
