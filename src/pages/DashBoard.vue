<template>
  <div>
    <q-card class="q-ma-md" flat bordered>
 <q-card-section class='row q-gutter-x-md items-center'>
  <div class="col">
    <q-select v-model="dataFilter.idProject" :options="projectOptions" map-options emit-value label="Projetos" dense outlined clearable/>
  </div>
  <div class="col">
    <q-select v-model="dataFilter.idCollaborator" :options="collaboradorOptions" map-options emit-value label="Colaboradores" dense outlined clearable/>
  </div>
  <div class="col text-right">
    <q-btn color="blue"  label="Pesquisar" no-caps rounded @click='getDashBoard()'/>
  </div>
 </q-card-section>
 </q-card>
 <q-card class="q-ma-md" flat bordered v-if='dashboardData.length'>
<q-card-section v-for='project in dashboardData' :key='project.idProject'>
 <q-card flat bordered>
 <q-card-section class='row'>
  <div class='text-bold q-pr-sm'>
    Projeto:
  </div>
  <div>
    {{ project.vchProjectName }}
  </div>

 </q-card-section>
  <q-card-section class='text-bold q-py-none'>
    Tarefas:
 </q-card-section>

  <q-card-section v-if='project.taskCollaborator' >
  <q-card class="q-mx-md q-my-sm" flat bordered v-for='task in project.taskCollaborator' :key="task.idTask">
  <q-card-section class='row q-py-sm'>
    <div class='text-bold q-pr-sm'>Tarefa:</div>
    <div>{{task.vchTaskName}}</div>

  </q-card-section>
    <q-card-section class='row q-py-sm'>
      <div class='text-bold q-pr-sm'> Descrição:</div>
    <div>{{task.vchDescription}}</div>

  </q-card-section>
   <q-card-section class='row q-py-sm'>
    <div class='text-bold q-pr-sm'>Colaborador atribuído:</div>
    <div>    {{task.vchCollaboratorName || 'Sem colaborador atribuído'}}</div>

  </q-card-section>
   <q-card-section class='text-bold q-pb-none q-pt-sm'>
    Tempos rastreados:
  </q-card-section>
<q-card-section>
    <q-card class="q-mx-md" flat bordered>
      <q-list bordered separator>
        <q-item  v-for='time in task.timeTrackeds' :key='time.idTimeTracked'>
          <div v-if='time.idTimeTracked'  class='items-center row'>
        <div>{{time.dtmStart}} - {{time.dtmEnd}}</div>
    </div>
    <div v-else class='items-center row'>
      Não há tempos rastreados
    </div>
        </q-item>

      </q-list>


    </q-card>

  </q-card-section>
  </q-card>

</q-card-section>
 <q-card-section v-else>
  Não há tarefas associadas a esse projeto
 </q-card-section>
 </q-card>

 </q-card-section>
 </q-card>
 <q-card class="q-ma-md  flex flex-center" flat bordered style='height: 80vh;' v-else>
 <q-card-section class='text-bold text-h5'>
Não há dados para o filtro aplicado, tente aplicar um filtro diferente
 </q-card-section>
 </q-card>

  </div>



</template>

<script>
  import DashboardService from 'src/services/DashboardService'
  import CollaboratorService from 'src/services/CollaboratorService'
  import ProjectService from 'src/services/ProjectService'
  import notify from 'src/mixins/notify'
export default {
  name: 'Dashboard',
  mixins:[notify],
  data(){
    return {
      DashboardService: new DashboardService(),
      ProjectService: new ProjectService(),
      CollaboratorService: new CollaboratorService(),
      dataFilter:{
        idProject: null,
        idCollaborator: null
      },
      projectOptions: [],
      collaboradorOptions: [],
      dashboardData: []
    }
  },
  mounted(){
    this.getCollaborators()
    this.getProject()
    this.getDashBoard()
  },
  methods:{
      getDashBoard(){
        this.DashboardService.getDashboard(this.dataFilter)
        .then((res)=>{
          this.dashboardData = res
        })
        .catch((error)=>{
          this.errorNotify(error.message)
        })
      },
        getCollaborators(){
        this.CollaboratorService.list()
        .then((res)=>{
          this.collaboradorOptions = res.map(item=>{
            const data = {
              value: item.idCollaborator,
              label: item.vchCollaboratorName
            }
            return data
          })
        })
        .catch((error)=>{
          this.errorNotify(error.message)
        })
      },
        getProject(){
        this.ProjectService.list().then((res)=>{
          this.projectOptions = res.map(item=>{
            const data = {
              label: item.vchProjectName,
              value: item.idProject
            }
            return data
          })
        })
        .catch((error)=>{
          this.errorNotify(error.message)
        })
      }
    }
}
</script>
