<template>
  <div class='row justify-center'>
   <q-card class="q-ma-md col-4">
    <q-card-section class='text-h3 text-center'>
    Login
  </q-card-section>
    <q-form @submit="login(loginObj)" class="q-gutter-md" >
      <q-card-section class='text-h3 text-center'>
        <q-input dense outlined class='col-3'  v-model="loginObj.vchUserName" label="Login"
          lazy-rules :rules="[ val => val !== null && val !== '' || 'Login inválido']"
          />
          <q-input dense outlined :type="isPWD?'password':'text'" v-model="loginObj.vchPassword" label="Senha" lazy-rules
          :rules="[
          val => val !== null && val !== '' || 'Senha inválida',
          ]"
          >
          <template v-slot:append>
          <q-icon :name="!isPWD?'visibility':'visibility_off'" @click='isPWD=!isPWD'/>
        </template>
        </q-input>
   </q-card-section>
   <q-card-actions vertical align="center" class='q-pb-md'>
    <q-btn label="Login" type="submit" color="primary"/>

  </q-card-actions>

  </q-form>
   </q-card>

  </div>
</template>

<script>
import AuthService from 'src/services/AuthService'
import notify from 'src/mixins/notify'
export default{
mixins:[notify],
  data(){
    return {
      AuthService: new AuthService(),
      loginObj:{
        vchUserName: "",
        vchPassword:""
      },
      isPWD:true
    }
  },
  methods:{
    login(data){
      const login = {
        vchUserName: data.vchUserName,
        vchPassword: data.vchPassword
      }
      this.AuthService.login(login)
      .then((token)=>{
        localStorage.setItem('jwtoken', token)
        this.$router.push({name:'dashboard'})
      })
      .catch((error)=>{
        this.errorNotify(error)
      })
    }
  }
}
</script>
