import {DateTime} from 'luxon'
export default {
  methods: {
    formatDate(date) {
      if (date) {
        const dateInUTC = DateTime.fromISO(date);
        const returnDate = dateInUTC.toFormat("dd/MM/yyyy HH:mm:ss");
        return returnDate;
      } else {
        return "Sem dados";
      }
    },
    formatDateTime(date, timezone) {
      const formatter = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "long",
        timeZone: timezone,
      }).format(date);
      return formatter;
    },
    formatToSendToBack(date) {
      const [dateTimePart, timeZonePart] = date.includes("BRT")
        ? date.split(" BRT")
        : date.split(" GMT");
      const [day, month, year] = dateTimePart.split("/");
      const [year1, time] = year.split(", ");
      const [hours, minutes, seconds] = time.split(":");
      const formattedDate = `${year1}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      return formattedDate;
    },
    formatDateTimeFromBack(date, timezone) {
      const dateInUTC =
        date.length === 19
          ? DateTime.fromFormat(date, "yyyy-MM-dd'T'HH:mm:ss")
          : DateTime.fromFormat(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
      const formatedDate = dateInUTC.setZone(timezone);
      const returnDate = `${formatedDate.toFormat("dd/MM/yyyy, HH:mm:ss")} ${
        formatedDate.offsetNameShort
      }`;
      return returnDate;
    },
    convertToDateTime(time, timezone) {
      const currentDate = DateTime.now().setZone(timezone);
      let [hours, minutes, seconds] = [0, 0, 0];
      if (time.includes(":")) {
        [hours, minutes, seconds] = time.split(":").map(Number);
      }
      const updatedDateTime = currentDate.set({
        hour: hours,
        minute: minutes,
        second: seconds,
      });
      return updatedDateTime.toJSDate();
    },
    parseCustomDateFormat (dateStr) {
      let isoDateStr = null
      if (dateStr.includes(' BRT')) {
        const [dateTimePart, timeZonePart] = dateStr.split(' BRT');
        const [datePart, timePart] = dateTimePart.trim().split(', ');
        const [hours, minutes, seconds] = timePart.split(':');
        isoDateStr = `${hours}:${minutes}:${seconds}`;
      } else {
        const [dateTimePart, timeZonePart] = dateStr.split(' GMT');
        const [datePart, timePart] = dateTimePart.trim().split(', ');

        const [hours, minutes, seconds] = timePart.split(':');
        isoDateStr = `${hours}:${minutes}:${seconds}`;
      }
      return isoDateStr
  },
   validateTime(startTime, endTime){
    return startTime<=endTime
  },
  calculateSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  },
  getTotalTime(timeList){
    let totalSeconds = 0;
        timeList.forEach(entry => {
          const [date1, date2] = entry.split(' - ').map(date => date.trim());

          if (!date1 || !date2) {
            console.error('Formato de entrada inválido:', entry);
            return;
          }

          let startDate = DateTime.fromISO(this.parseCustomDateFormat(date1));
          let endDate = DateTime.fromISO(this.parseCustomDateFormat(date2));
          if (!startDate.isValid || !endDate.isValid) {
            console.error('Erro ao criar objetos DateTime:', date1, date2);
            return;
          }
          const diffInSeconds = endDate.diff(startDate, 'seconds').seconds;

          totalSeconds += diffInSeconds;
        });

        totalSeconds = Math.min(totalSeconds, 86400);

        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');

        return `${hours}:${mins}:${secs}`;
  }
  },
};
