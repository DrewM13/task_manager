import BaseService from './BaseService';
export default class AuthService extends BaseService{
  constructor(){
    super('/auth')
  }

  login = async (data) => {
    try {
      const response = await this.http.post(this.api, data)
      return response.data
    } catch (error) {
      throw error
    }

  }
}



