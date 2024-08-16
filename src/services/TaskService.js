import BaseService from './BaseService';
export default class TaskService extends BaseService{
  constructor(){
    super('/task')
  }

  GetByIDProject = async (idProject) => {

    try {
      const response = await this.http.get(`${this.api}/getbyidproject/${idProject}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

