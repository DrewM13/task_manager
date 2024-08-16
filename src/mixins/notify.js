import { Notify } from 'quasar'

export default{
  methods:{
    errorNotify (msg) {
      Notify.create({
        message: msg,
        color: 'red-10',
        icon:'error',
        position: 'top',
        timeout: 2500,
      })
    },
     successNotify (msg) {
      Notify.create({
        message: msg,
        color: 'green-9',
        icon:'check',
        position: 'top',
        timeout: 2500,
      })
    },
      warningNotify (msg) {
        Notify.create({
        message: msg,
        color: 'amber',
        icon:'warning',
        position: 'top',
        timeout: 2500,
      })
    },
  }

}
