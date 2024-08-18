<template>

<q-card class="q-ma-md"  style="height: 90vh ;">
  <q-card-section class='row '>
    <div class='col text-bold text-h5'>
      <q-icon name="view_timeline" size='md'/>
      Projetos
    </div>
    <div class='text-right col'>
      <q-btn color="green" text-color="white" label="Adicionar" icon='add' rounded @click="addDialog = true"/>
    </div>

  </q-card-section>
  <q-separator    />
<q-card-section v-if='dataList.length'>
  <q-table separator='cell' flat bordered :data="dataList" :columns="columns"  row-key="idProject" :filter="filter">
    <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Pesquisar" >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-dropdown color="white" text-color="black" icon='settings' >
<q-list bordered>
  <q-item clickable v-ripple @click="$router.push({name:'tasks', params: {id: props.row.idProject}})">
    <q-item-section avatar>
      <q-icon color="indigo" name="task" />
    </q-item-section>
    <q-item-section>Tarefa</q-item-section>
  </q-item>
    <q-item clickable v-ripple @click="editDialog = true; editData = props.row">
    <q-item-section avatar>
      <q-icon color="amber" name="edit" />
    </q-item-section>
    <q-item-section>Editar</q-item-section>
  </q-item>
  <q-item clickable v-ripple @click='deleteProject(props.row)'>
    <q-item-section>
      <q-icon color="red" name="delete" size='sm'/>
    </q-item-section>
    <q-item-section>Excluir</q-item-section>
  </q-item>
</q-list>
      </q-btn-dropdown>
        </q-td>
      </template>
  </q-table>

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
<q-inner-loading :showing="isLoading" class='bg-white'>
 <q-spinner-gears size="50px" color="primary" />
 Carregando dados...
 </q-inner-loading>
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
      filter: '',
      columns:[
        {
          name: 'vchProjectName',
          label:'Nome',
          field:'vchProjectName',
          align:'left'
        },
        {
          name: 'dtmCreatedAt',
          label:'Data de criação',
          field:'dtmCreatedAt',
          align:'center',
          format:(val)=>{return this.formatDate(val)}
        },
        {
          name: 'dtmUpdatedAt',
          label:'Data de atualização',
          field:'dtmUpdatedAt',
          align:'center',
          format:(val)=>{return this.formatDate(val)}
        },
           {
          name: 'actions',
          label:'Ações',
          field:'actions',
          align:'right',
          style: 'width: 10px'
        },
      ],
      isLoading: false
    }
  },
  mounted(){
    this.getProjects()
  },
  methods:{
    getProjects(){
      this.isLoading = true
      this.ProjectService.list()
      .then((res)=>{
        this.dataList = res
        this.isLoading = false
      })
      .catch((err)=>{
        this.errorNotify(err.message)
        this.isLoading = false
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
