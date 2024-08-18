import BaseService from './BaseService';
export default class TimeTrackerService extends BaseService{
  constructor(){
    super('/timetrackers')
  }

   getByIDTask = async (idTask) =>{
    try {
      const response = await this.http.get(`${this.api}/getbyidtask/${idTask}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
  removeList = async data => {
    try {
      const response = await this.http.delete(`${this.api}/delete`,{data: data} )
      return response.data
    } catch (error) {
      throw error
    }
  }
}

