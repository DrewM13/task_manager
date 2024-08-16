<template>
  <div class='row justify-center'>
   <q-card class="q-ma-md col-4">
    <q-card-section class='text-h3 text-center'>
    Login
  </q-card-section>
    <q-form @submit="onSubmit()" class="q-gutter-md" >
      <q-card-section class='text-h3 text-center'>
        <q-input dense outlined class='col-3'  v-model="mail" label="Login"
          lazy-rules :rules="[ val => val !== null && val !== '' || 'Login inválido']"
          />
          <q-input dense outlined :type="isPWD?'password':'text'" v-model="password" label="Senha" lazy-rules
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

export default{

  data(){
    return {
  mail: "",
  password:"",
  isPWD:true,
    }
  },
  method:{
    onSubmit(){

    },
    emailValidation(mail){
      const validator = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i
      console.log(mail);
      console.log(validator.test(mail));

      if(validator.test(mail)){
        return true
      } else{
        return false
      }
    }
  }
}
</script>
