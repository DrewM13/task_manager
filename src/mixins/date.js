import {DateTime} from 'luxon'
export default{
  methods:{
    formatDate(date){
      if(date){

        return DateTime.fromISO(date).toFormat('dd/MM/yyyy HH:mm')
      } else{
        return "Sem dados"
      }
    },
    formatDateTime(date, timeFormat) {
      console.log(date);
      console.log(timeFormat);

      switch (timeFormat) {
        case 'ISO':
          return date.toISOString();
        default:
          return DateTime.fromJSDate(date).toFormat('dd/MM/yyyy HH:mm:ss');
      }
    },
    formatDateTimeFromBack(date) {
      return DateTime.fromISO(date).toFormat('dd/MM/yyyy HH:mm:ss');
},
    convertDateTimeToZone(time, format) {
       const dt = DateTime.fromISO(time, { zone: 'utc' });
       const zonedDateTime = dt.setZone('America/Sao_Paulo');
       const formattedDate = zonedDateTime.toLocaleString(DateTime.DATETIME_FULL);
       return formattedDate;
    },
    convertToDateTime(time) {
      const currentDate = new Date();
      let [hours, minutes, seconds] =[0,0,0]
      if(time.includes(':')){
      [hours, minutes, seconds] = time.split(':').map(Number);
      currentDate.setHours(hours, minutes, seconds)
        }
        return currentDate
    },
  }
}
