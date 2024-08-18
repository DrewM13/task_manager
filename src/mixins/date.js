import {DateTime} from 'luxon'
export default{
  methods:{
    formatDate(date){
      if(date){
        const dateInUTC = DateTime.fromISO(date)
        const returnDate = dateInUTC.toFormat('dd/MM/yyyy HH:mm:ss')
        return returnDate
      } else{
        return "Sem dados"
      }
    },
    formatDateTime(date, timezone) {
       const formatter = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'long',
        timeZone: timezone,
      }).format(date)
      return formatter
    },
    formatToSendToBack(date, timezone){

    },
    formatDateTimeFromBack(date, timezone) {
      //pendente correção
      console.log(DateTime.fromSQL(date, { zone: timezone }));

      const dateInUTC = date.length === 19 ? DateTime.fromFormat(date,"yyyy-MM-dd'T'HH:mm:ss"): DateTime.fromFormat(date,"yyyy-MM-dd'T'HH:mm:ss.SSS")
      const formatedDate = dateInUTC.setZone(timezone)
      const returnDate = `${formatedDate.toFormat('dd/MM/yyyy, HH:mm:ss')} ${formatedDate.offsetNameShort}`
      return returnDate
    },
    convertToDateTime(time,timezone) {
  const currentDate = DateTime.now().setZone(timezone);
  let [hours, minutes, seconds] = [0, 0, 0];
  if (time.includes(':')) {
    [hours, minutes, seconds] = time.split(':').map(Number);
  }
  const updatedDateTime = currentDate.set({
    hour: hours,
    minute: minutes,
    second: seconds
  });
   return updatedDateTime.toJSDate();
    },
  }
}
