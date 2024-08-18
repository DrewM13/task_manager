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
      const [datePart, timePart] = dateTimePart.trim().split(", ");
      const [day, month, year] = date.split("/");
      const [year1, time] = year.split(", ");
      const [hours, minutes, seconds] = timePart.split(":");
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
  },
};
