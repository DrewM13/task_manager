import BaseService from './BaseService';
export default class DashboardService extends BaseService{
  constructor(){
    super('/dashboard')
  }

  getDashboard = async (data) => {
    try {
      const response = await this.http.post(`${this.api}/getdashboard`, data)
      return response.data
    } catch (error) {
      throw error
    }

  }
}

