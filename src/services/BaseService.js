import { http } from './HttpService'

export default class BaseService {
  constructor (api) {
    this.api = api
    this.http = http
  }
  list = async () => {
    try {
      const response = await http.get(`${this.api}/get`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  listByID = async id => {
    try {
      const response = await http.get(`${this.api}/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  create = async data => {
    try {
      const response = await http.post(`${this.api}/create`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }
  update = async data => {
    try {
      const response = await http.put(`${this.api}/update`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }
  remove = async id => {
    try {
      const response = await http.delete(`${this.api}/delete/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
