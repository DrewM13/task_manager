<template>

<q-card class="q-ma-md"  style="height: 90vh ;">
  <q-card-section class='row '>
    <div class='col text-bold text-h5'>
      <q-icon name="view_timeline" size='md'/>
      Projetos
    </div>
    <div class='text-right col'>
      <q-btn color="green" text-color="white" label="Adicionar" rounded  @click="addDialog = true"/>
    </div>

  </q-card-section>
  <q-separator    />
<q-card-section v-if='dataList.length'>
<q-list bordered v-for='(data, idx) in dataList' :key='idx'>
  <q-item class='row'>
    <q-item-section >
      Nome: {{ data.vchProjectName }}
    </q-item-section>
    <q-item-section>Data de criação: {{formatDate(data.dtmCreatedAt)  }}</q-item-section>
    <q-item-section>Data da última atualização: {{formatDate(data.dtmUpdatedAt)  }}</q-item-section>
    <q-item-section class='col-auto'>
      <q-btn-dropdown color="white" text-color="black" icon='settings' >
<q-list bordered>
  <q-item clickable v-ripple @click="$router.push({name:'tasks', params: {id: data.idProject}})">
    <q-item-section avatar>
      <q-icon color="indigo" name="task" />
    </q-item-section>
    <q-item-section>Tarefa</q-item-section>
  </q-item>
    <q-item clickable v-ripple @click="editDialog = true; editData = data">
    <q-item-section avatar>
      <q-icon color="amber" name="edit" />
    </q-item-section>
    <q-item-section>Editar</q-item-section>
  </q-item>
  <q-item clickable v-ripple @click='deleteProject(data)'>
    <q-item-section>
      <q-icon color="red" name="delete" size='sm'/>
    </q-item-section>
    <q-item-section>Excluir</q-item-section>
  </q-item>
</q-list>
      </q-btn-dropdown>
    </q-item-section>

  </q-item>
</q-list>
</q-card-section>
<q-card-section style="height: 70vh ;" v-else class='justify-center items-center flex q-ma-none'>
  Não há projetos adicionados
</q-card-section>
<q-dialog v-model="editDialog">
<q-card class='full-width'>
<q-card-section>
<div class="text-h6">Editar projeto</div>
</q-card-section>
<q-card-section>
<q-input dense  outlined v-model="editData.vchProjectName" label="Nome do projeto" />
</q-card-section>
<q-card-actions align="right" class='q-pr-md'>
<q-btn flat label="Cancelar" no-caps color="grey" rounded v-close-popup />
<q-btn label="Editar" no-caps color="amber-8" rounded @click='editProject(editData)' />
</q-card-actions>
</q-card>
</q-dialog>

<q-dialog v-model="addDialog">
<q-card class='full-width'>
<q-card-section>
<div class="text-h6">Adicionar projeto</div>
</q-card-section>
<q-card-section>
<q-input dense  outlined v-model="addData.vchProjectName" label="Nome do projeto" />
</q-card-section>
<q-card-actions align="right" class='q-pr-md'>
<q-btn flat label="Cancelar" no-caps color="grey" v-close-popup rounded @click='addData = {}' />
<q-btn label="Salvar" no-caps color="green" rounded @click='addProject(addData)' />
</q-card-actions>
</q-card>
</q-dialog>

</q-card>


</template>
<script>
import ProjectService from 'src/services/ProjectService';
import Notify from 'src/mixins/notify'
import date from 'src/mixins/date'
export default{
  mixins:[Notify, date],
  data(){
    return{
      ProjectService: new ProjectService(),
      dataList:[],
      editData:{},
      addData:{},
      editDialog:false,
      addDialog:false,
    }
  },
  mounted(){
    this.getProjects()
  },
  methods:{
    getProjects(){
      this.ProjectService.list()
      .then((res)=>{
        this.dataList = res
      })
      .catch((err)=>{
        this.errorNotify(err.message)
      })
    },
    editProject(data){
      this.ProjectService.update(data)
      .then(()=>{
        this.getProjects()
        this.editDialog = false
        this.successNotify(`Projeto ${data.vchProjectName} editado com sucesso!`)
      })
      .catch((err)=>{
        this.errorNotify('Erro ao editar projeto: ' + err.message)
      })

    },
      addProject(data){
      this.ProjectService.create(data)
      .then(()=>{
        this.getProjects()
        this.addDialog = false
        this.successNotify(`Projeto ${data.vchProjectName} criado com sucesso!`)

      })
      .catch((err)=>{
        this.errorNotify('Erro ao criar projeto: ' + err.message)
      })

    },
    deleteProject(data){
      this.$q.dialog({
        title: 'Atenção',
        message: `Deseja remover o projeto ${data.vchProjectName}?`,

        cancel: true,
        persistent: true,
        cancel: {color: 'grey', outline: true,  noCaps: true},
        ok: {color: 'red',noCaps: true}

      }).onOk(() => {
        this.ProjectService.remove(data.idProject)
      .then(()=>{
        this.getProjects()
      })
      .catch((err)=>{
        this.errorNotify(err.message)
      })
      })

    }
  }
}
</script>
