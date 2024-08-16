<template>
  <q-card class="q-ma-md " style="height: 90vh ;">
    <q-card-section class='row'>
      <div class='col text-bold text-h5'>
        <q-icon name="task" size='md'/>
        Tarefas
      </div>
      <div class='text-right col'>
        <q-btn color="green" text-color="white" label="Adicionar"  @click="addDialog = true"/>
      </div>
    </q-card-section>
    <q-separator  />
  <q-card-section v-if='dataList.length' class='row q-gutter-md'>
 <q-card v-for="(data, idx) in dataList" :key="idx" class="col-auto column">
        <q-card-section class='row items-center col'>
            <div class='col text-bold text-left'>
              Nome:
            </div>
             <div class='col text-right ellipsis'>
              {{ data.vchTaskName }}
            </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class='row items-center col'>
            <div class='col text-bold text-left'>
              Descrição:
            </div>
             <div class='col text-right ellipsis'>
              {{ data.vchDescription }}
            </div>
        </q-card-section>
        <q-separator/>
         <q-card-section class='row items-center col'>
  <div class='col text-bold text-left'>
    Responsável:
  </div>
  <div class='col text-right ellipsis'>
    {{ data.vchCollaboratorName || 'Sem atribuição' }}
  </div>

        </q-card-section>
        <q-separator/>
         <q-card-section class='row items-center col'>
  <div class='col text-bold text-left'>
    Tempo rastreado:
  </div>
  <div class='col text-right text-right'>
    <!-- {{ getTimeTracked(data.timeTraked) }} -->
  </div>

        </q-card-section>
        <q-separator/>
          <q-card-section class='row items-center col'>
  <div class='col text-bold text-left'>
   Status:
  </div>
  <div class='col text-right text-right'>
    {{ data.vchStatus }}
  </div>

        </q-card-section>
        <q-separator/>
        <q-card-section class='row'>
          <div class='col'>

            <q-btn-dropdown color="white" text-color="black" icon='settings' >
      <q-list bordered>
        <q-item clickable v-ripple v-close-popup @click="getTimeTracked(data.idTask); taskData = data" v-if='data.vchCollaboratorName !== null'>
          <q-item-section avatar>
            <q-icon color="grey" name="timer" />
          </q-item-section>
          <q-item-section>Tempo gasto</q-item-section>
        </q-item>
         <q-item clickable v-ripple v-close-popup @click="viewDialog = true; taskData = data;">
          <q-item-section avatar>
            <q-icon color="indigo" name="preview" />
          </q-item-section>
          <q-item-section>Visualizar</q-item-section>
        </q-item>
          <q-item clickable v-ripple v-close-popup @click="editDialog = true; editData = {...data}; originalData = data">
          <q-item-section avatar>
            <q-icon color="amber" name="edit" />
          </q-item-section>
          <q-item-section>Editar</q-item-section>
        </q-item>
        <q-item clickable v-ripple v-close-popup @click='deleteTask(data)'>
          <q-item-section>
            <q-icon color="red" name="delete" size='sm'/>
          </q-item-section>
          <q-item-section>Excluir</q-item-section>
        </q-item>
      </q-list>
            </q-btn-dropdown>
          </div>
        </q-card-section>


    </q-card>

  </q-card-section>
  <q-card-section style="height: 70vh ;" v-else class='justify-center items-center flex q-ma-none'>
    Não há tarefas adicionadas
  </q-card-section>

  <!--Edição -->
  <q-dialog v-model="editDialog">
  <q-card class='full-width'>
  <q-card-section>
  <div class="text-h6">Editar Tarefa</div>
  </q-card-section>
  <q-card-section>
  <q-input dense outlined v-model="editData.vchTaskName" label="Nome  da tarefa" />
  </q-card-section>
  <q-card-section>
  <q-input dense outlined v-model="editData.vchDescription" label="Descrição  da tarefa" />
  </q-card-section>
   <q-card-section>
  <q-select dense outlined v-model="editData.idCollaborator"  emit-value map-options :options='collaboratorsOpt' label="Responsável" />
  </q-card-section>
  <q-card-actions align="right">
  <q-btn flat label="Cancelar" no-caps color="grey" v-close-popup />
  <q-btn label="Editar" no-caps color="amber" @click='editTask(editData, originalData)' />
  </q-card-actions>
  </q-card>
  </q-dialog>
<!-- Adição -->
  <q-dialog v-model="addDialog">
  <q-card class='full-width'>
  <q-card-section>
  <div class="text-h6">Adicionar tarefa</div>
  </q-card-section>
  <q-card-section>
  <q-input dense outlined v-model="addData.vchTaskName" label="Nome da tarefa" />
  </q-card-section>
  <q-card-section>
  <q-input dense outlined v-model="addData.vchDescription" label="Descrição da tarefa" />
  </q-card-section>
  <q-card-section>
  <q-select dense outlined v-model="addData.idCollaborator" emit-value map-options :options='collaboratorsOpt' label="Responsável" />
  </q-card-section>
  <q-card-actions align="right">
  <q-btn flat label="Cancelar" no-caps color="grey" v-close-popup @click='addData = {}' />
  <q-btn label="Salvar" no-caps color="green" @click='addTask(addData)' />
  </q-card-actions>
  </q-card>
  </q-dialog>
  <!-- Visualização -->
  <q-dialog v-model="viewDialog">
  <q-card class='full-width'>
    <q-card-section class='text-right q-pa-xs'>
       <q-btn color="red" icon='close' dense size='md' flat rounded @click='viewDialog = false'/>

    </q-card-section>
    <q-card-section class='row items-center col-2'>
          <div class='col text-bold text-left'>
            Nome:
          </div>
           <div class='col text-right '>
            {{ taskData.vchTaskName }}
          </div>
      </q-card-section>
      <q-separator/>
      <q-card-section class='row items-center col-2'>
          <div class='col text-bold text-left'>
            Descrição:
          </div>
           <div class='col text-right'>
            {{ taskData.vchDescription }}
          </div>
      </q-card-section>
      <q-separator/>
       <q-card-section class='row items-center col-2'>
<div class='col text-bold text-left'>
  Responsável:
</div>
<div class='col text-right'>
  {{ taskData.vchCollaboratorName || 'Sem atribuição' }}
</div>

      </q-card-section>
      <q-separator/>
       <q-card-section class='row items-center col-2'>
<div class='col text-bold text-left'>
  Tempo rastreado:
</div>
<div class='col text-right text-right'>
  <!-- {{getTimeTracked(taskData.timeTraked)}} -->
</div>

      </q-card-section>
      <q-separator/>
        <q-card-section class='row items-center col-2'>
<div class='col text-bold text-left'>
 Status:
</div>
<div class='col text-right text-right'>
  {{taskData.vchStatus}}
</div>

      </q-card-section>
  </q-card>
  </q-dialog>
<!-- Rastreador -->
<q-dialog v-model="timerDialog" persistent>
<q-card  class=' full-width'>
<q-card-section class='row'>
<div class="text-h6 col">Tempo rastreado na tarefa</div>
<div class="text-h6 text-right col"> {{ totalTime }}</div>
</q-card-section>
<q-card-section>
  <q-toggle v-model="isInputTime" label='Inserir tempo manualmente'/>

  <div v-if='isInputTime' class='row q-gutter-x-sm'>
    <div class="col">
      <q-input reactive-rules :rules="[val=> validateTime(val, endTimeInput) || 'O tempo inicial não pode ser maior que o final']" dense outlined v-model="startTimeInput" mask='##:##:##' label="Tempo inicial" class='col'>
      <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time
                v-model="startTimeInput"
                with-seconds
                format24h
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fechar" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
    </q-input>
  </div>
    <div class="col">
       <q-input reactive-rules :rules="[val=> validateTime(startTimeInput, val) || 'O tempo final não pode ser menor que o inicial']" dense outlined v-model="endTimeInput" mask='##:##:##' label="Tempo final" class='col'>
      <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time
                v-model="endTimeInput"
                with-seconds
                format24h
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fechar" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
    </q-input>
  </div>
    <div class="col-auto q-pt-xs">
      <q-btn color="green" dense rounded flat icon='add' @click=addTimeByInput() :disable="validateInput() || !validateTime(startTime, endTime)">
            <q-tooltip>
             Adicionar
            </q-tooltip>
           </q-btn>
    </div>



  </div>
  <div v-else>
    <q-input readonly mask='##:##:##' dense outlined v-model="timeInput" label="Tempo rastreado" placeholder='insira o tempo (04:10:00)'>
        <template v-slot:append>
           <q-btn :color="timerRunning?'red':'grey'" dense rounded flat icon='timer' @click='toggleTimer()' :disable="totalTime =='24:00:00'">
            <q-tooltip>
             {{ timerRunning?'Parar cronomêtro':'Iniciar cronomêtro' }}
            </q-tooltip>
           </q-btn>
            <q-btn color="green" dense rounded flat icon='add' @click=addTime() :disable="timeInput =='00:00:00' || timerRunning">
            <q-tooltip>
             Adicionar
            </q-tooltip>
           </q-btn>
        </template>
      </q-input>
  </div>

      <q-select
        :disable='timeList.length>0'
        outlined
        dense
        v-model="timeFormat"
        :options="['ISO', 'Local']"
        label="Formato da Data"
        class="q-mt-md"
      />

</q-card-section>
<q-card-section>
<q-list bordered separator>
  <q-item class='row items-center' v-for='(time, idx) in timeList' :key='idx'>
    <div class='col'>
     {{ time }}
    </div>
    <div class='col text-right q-gutter-x-sm'>
      <q-btn color="red" outline round icon='close' size='sm' @click='deleteTime(time, idx)'>
        <q-tooltip>
          Excluir
        </q-tooltip>
      </q-btn>
    </div>
  </q-item>

</q-list>
</q-card-section>
<q-card-actions align="right">
<q-btn  label="Cancelar" color="grey" no-caps rounded v-close-popup @click='reset()'/>
<q-btn :disable='!timeList.length' label="Salvar" color="primary" @click='createTimeTask(timeFormat)' no-caps rounded />
</q-card-actions>
</q-card>
</q-dialog>

  </q-card>

  </template>
  <script>
  import TaskService from 'src/services/TaskService';
  import CollaboratorService from 'src/services/CollaboratorService';
  import TimeTrackerService from 'src/services/TimeTrackerService';
  import Notify from 'src/mixins/notify'
  import date from 'src/mixins/date'
  import {DateTime} from 'luxon'
  export default{
    mixins:[Notify, date],
    data(){
      return{
        TaskService: new TaskService(),
        CollaboratorService: new CollaboratorService(),
        TimeTrackerService: new TimeTrackerService(),
        dataList:[],
        taskData:{},
        editData:{},
        originalData:{},
        addData:{},
        editDialog:false,
        addDialog:false,
        viewDialog:false,
        timerDialog:false,
        timerRunning:false,
        isInputTime:false,
        timeList:[],
        timeTraked:[],
        collaboratorsOpt:[],
        timesToDelete:[],
        timer: null,
        timeInput: '00:00:00',
        timeFormat: 'Local',
        startTime: null,
        startTimeInput: null,
        endTime: null,
        endTimeInput: null,
      }
    },
    mounted(){
        this.getTasks()
        this.getCollaboratos()
    },
    beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  computed: {
    totalTime() {
      let totalSeconds = 0;
    this.timeList.forEach(entry => {
      const [date1, date2] = entry.split(' - ').map(date => date.trim());

      if (!date1 || !date2) {
        console.error('Formato de entrada inválido:', entry);
       return;
      }

      let startDate, endDate;

      if (this.timeFormat !== 'Local') {
       startDate = new Date(date1);
       endDate = new Date(date2);
      } else {
        startDate = this.parseCustomDateFormat(date1);
        endDate = this.parseCustomDateFormat(date2);
      }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Erro ao criar objetos Date:', date1, date2);
    return;
  }
  const diffInSeconds = (endDate - startDate) / 1000;

  totalSeconds += diffInSeconds;
});

totalSeconds = Math.min(totalSeconds, 86400);

const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
const secs = String(totalSeconds % 60).padStart(2, '0');

return `${hours}:${mins}:${secs}`;

    },
    isAddButtonDisabled() {
      const totalSecondsInInput = this.calculateSeconds(this.timeInput);
      const maxSeconds = 86400;
      return (
        this.totalTime >= maxSeconds ||
        this.totalTime + totalSecondsInInput > maxSeconds
      );
    }
  },
    methods:{
      parseCustomDateFormat (dateStr) {
     const [datePart, timePart] = dateStr.split(' ');
       const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');
      return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    },
      validateTime(startTime, endTime){
        return startTime<=endTime
      },
      validateInput (){
        const isNull = this.startTimeInput== null || this.endTimeInput == null
        const isEmpty = this.startTimeInput == '' || this.endTimeInput == ''
        return  isNull || isEmpty
      },
      getTasks(){
        this.TaskService.GetByIDProject(this.$route.params.id)
        .then((res)=>{
          this.dataList = res
        })
        .catch((err)=>{
          this.errorNotify(err.message)
        })
      },
      getCollaboratos(){
        this.CollaboratorService.list()
        .then((res)=>{
          this.collaboratorsOpt = res.map(item=> {
            return {
                value: item.idCollaborator,
                label: item.vchCollaboratorName
            }

          })
        })
        .catch((err)=>{
          this.errorNotify(err.message)
        })
      },
      getTimeTracked(idTask){
        this.TimeTrackerService.getByIDTask(idTask)
        .then((res)=>{

          this.timeTraked = [...res]
          this.timeList = res.map(item=>{
            this.timeFormat = item.vchTimeZoneID
            const formattedStart = this.formatDateTimeFromBack(item.dtmStart);
            const formattedEnd = this.formatDateTimeFromBack(item.dtmEnd);
            const entry = `${formattedStart} - ${formattedEnd}`;
            return entry
          })
          this.timerDialog = true;
        }).catch(()=>{
          this.errorNotify('Erro ao listar tempos rastreados')
        })
      },
      calculateSeconds(time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return (hours * 3600) + (minutes * 60) + seconds;
    },

    toggleTimer() {
      if (this.timerRunning) {
        clearInterval(this.timer);
        this.timerRunning = false;
         this.endTime = new Date();
      } else {
        this.startTimer();
      }
    },
    startTimer() {
      let [hours, minutes, seconds] = [0, 0, 0];

      if (this.timeInput.includes(':')) {
        [hours, minutes, seconds] = this.timeInput.split(':').map(Number);
      }

      this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
      this.startTime = new Date();

      this.timerRunning = true;
      this.timer = setInterval(() => {
        this.totalSeconds++;

        if (this.totalSeconds >= 86400) {
          this.totalSeconds = 86400;
          this.timeInput = "24:00:00";
          this.toggleTimer();
        } else {
          const hrs = String(Math.floor(this.totalSeconds / 3600)).padStart(2, '0');
          const mins = String(Math.floor((this.totalSeconds % 3600) / 60)).padStart(2, '0');
          const secs = String(this.totalSeconds % 60).padStart(2, '0');
          this.timeInput = `${hrs}:${mins}:${secs}`;
        }
      }, 1000);
    },
    // stopTimer() {
    //   const formattedStart = this.formatDateTime(this.startTime);
    //   const formattedEnd = this.formatDateTime(this.endTime);
    //   const entry = `${formattedStart} - ${formattedEnd}`;
    //   this.timeList.push(entry);
    // },
    addTimeByInput(){
      if(this.startTimeInput && this.endTimeInput){
        this.startTime =  this.convertToDateTime(this.startTimeInput)
      this.endTime =  this.convertToDateTime(this.endTimeInput)
      const formattedStart = this.formatDateTime(this.startTime, this.timeFormat);
      const formattedEnd = this.formatDateTime(this.endTime, this.timeFormat);
      const entry = `${formattedStart} - ${formattedEnd}`;

        if(this.timeList.some(entry => entry.trim() === `${formattedStart} - ${formattedEnd}`)){
          this.errorNotify('O intervalo já existe!')
        }
        else if(this.isOverlapping(formattedStart, formattedEnd)){
          this.errorNotify('O intervalo não deve sobrepôr intervalos existentes!')
        }
        else{
          this.timeTraked.push({dtmStart: formattedStart, dtmEnd: formattedEnd})
          this.timeList.push(entry);
          this.timeInput = '00:00:00';
          this.startTime = null;
          this.startTimeInput = null;
          this.endTime = null;
          this.endTimeInput = null;
          this.totalSeconds = 0;
        }

      }

    },
    addTime() {
      if (this.startTime && this.endTime && !this.isAddButtonDisabled) {
        const formattedStart = this.formatDateTime(this.startTime, this.timeFormat);
        const formattedEnd = this.formatDateTime(this.endTime, this.timeFormat);
        const entry = `${formattedStart} - ${formattedEnd}`;
        if(this.isOverlapping(formattedStart, formattedEnd)){
        this.errorNotify('O intervalo não deve sobrepôr intervalos existentes!')
        }
        else if(this.timeList.some(entry => entry.trim() === `${formattedStart} - ${formattedEnd}`)){
        this.errorNotify('O intervalo já existe!')
        }
       else{
        this.timeTraked.push({dtmStart: formattedStart, dtmEnd: formattedEnd})
        this.timeList.push(entry);
        this.timeInput = '00:00:00';
        this.startTime = null;
        this.endTime = null;
        this.totalSeconds = 0;
        }
      }
    },
    isOverlapping(newStart, newEnd) {
    const newStartSeconds = this.timeFormat !== 'Local' ? newStart : this.calculateSeconds(newStart.split(' ')[1]);
    const newEndSeconds = this.timeFormat !== 'Local'  ? newEnd : this.calculateSeconds(newEnd.split(' ')[1]);
    const isOverlapping =  this.timeList.some(entry => {
      const [start, end] = entry.split(' - ').map(time => time.trim());
      const startSeconds = this.timeFormat !== 'Local'  ? start : this.calculateSeconds(start.split(' ')[1]);
      const endSeconds = this.timeFormat !== 'Local'  ? end : this.calculateSeconds(end.split(' ')[1]);
      return (newStartSeconds < endSeconds && newEndSeconds > startSeconds);
    });
    return isOverlapping
  },
    deleteTime(time, position){
      if(this.timeTraked[position].idTimeTracker != undefined){
        this.timesToDelete.push(this.timeTraked[position])
      }
      this.timeTraked.splice(position, 1)
      this.timeList.splice(position, 1)
    },
    reset(){
      this.timeList = []
      this.timeTraked = []
      this.timeInput = '00:00:00'
    },
      getStatus(){

      },
      editTask(data, originalData){
        const sendObj = {
          vchTaskName: data.vchTaskName,
          idTask: data.idTask,
          vchDescription: data.vchDescription,
        }
        this.TaskService.update(sendObj)
        .then(()=>{
          if(data.idCollaborator){
            if(originalData.idCollaborator != data.idCollaborator){
              this.$q.dialog({
          title: 'Atenção',
          message: `Esse colaborador pode ter tempos rastreados nessa tarefa, eles serão removidos, deseja continuar?`,

          cancel: true,
          persistent: true,
          cancel: {color: 'grey', outline: true,  noCaps: true},
          ok: {color: 'red',noCaps: true}

        }).onOk(() => {
          this.addOrEditCollaboratorToTask(data.idTask, data.idCollaborator)
        })
      } else{
        this.addOrEditCollaboratorToTask(data.idTask, data.idCollaborator)
      }
          } else{
            this.getTasks()
          this.editDialog = false
          this.successNotify(`Tarefa ${data.vchTaskName} editada com sucesso!`)
          }

        })
        .catch((err)=>{
          this.errorNotify('Erro ao editar projeto: ' + err.message)
        })

      },
      addTask(data){
        const sendObj = {
          vchTaskName: data.vchTaskName,
          vchDescription: data.vchDescription,
          idProject: this.$route.params.id
        }
        this.TaskService.create(sendObj)
        .then((res)=>{

          if(data.idCollaborator){
            this.addOrEditCollaboratorToTask(res.idTask, data.idCollaborator)
          } else{
            this.getTasks()
            this.addDialog = false
            this.successNotify(`Tarefa ${data.vchTaskName} criada com sucesso!`)
          }


        })
        .catch((err)=>{
          this.errorNotify('Erro ao criar tarefa: ' + err.message)
        })

      },
      addOrEditCollaboratorToTask(idTask, idCollaborator){
        const objToSend = {
          idTask: idTask,
          idCollaborator: idCollaborator
        }

        this.CollaboratorService.create(objToSend)
        .then(()=>{
            this.getTasks()
            this.addDialog = false
            this.editDialog = false
        })
        .catch((err)=>{
          this.errorNotify('Erro ao criar ou editar associação: ' + err.message)
        })
      },
      createTimeTask(timeFormat){
     const arrayData = this.timeTraked.map((data)=>{
       let dtmStart = null
       let dtmEnd = null
      if(timeFormat == 'Local'){
        dtmStart = DateTime.fromFormat(data.dtmStart, 'dd/MM/yyyy HH:mm:ss').toISO()
        dtmEnd = DateTime.fromFormat(data.dtmEnd, 'dd/MM/yyyy HH:mm:ss').toISO()
      } else{
        dtmStart = data.dtmStart
        dtmEnd = data.dtmEnd
      }
            data.vchTimeZoneID = timeFormat,
            data.idTask = this.taskData.idTask,
            data.idCollaborator = this.taskData.idCollaborator,
            data.dtmStart = dtmStart,
            data.dtmEnd = dtmEnd
          return data
        })
        this.TimeTrackerService.create(arrayData.filter(item=>!item.idTimeTracker))
          .then(()=>{
            this.successNotify('Rastreamento de tempo criado com sucesso')

          }).catch(()=>{
            this.errorNotify('Erro ao criar rastreamento de tempo')
          })
          this.deleteTimeTracker()
        this.getTasks()
        this.timerDialog = false

      },
      deleteTimeTracker(){
        if(this.timesToDelete.length){
          this.TimeTrackerService.remove(this.timesToDelete)
          .then(()=>{
            this.successNotify('Rastreamento de tempo removido com sucesso')

          }).catch(()=>{
            this.errorNotify('Erro ao remover rastreamento de tempo')
          })
        }

      },
      deleteTask(data){
        this.$q.dialog({
          title: 'Atenção',
          message: `Deseja remover o tarefa ${data.vchTaskName}?`,

          cancel: true,
          persistent: true,
          cancel: {color: 'grey', outline: true,  noCaps: true},
          ok: {color: 'red',noCaps: true}

        }).onOk(() => {
          this.TaskService.remove(data.idTask)
        .then(()=>{
          this.getTasks()
          this.successNotify('Tarefa excluída com sucesso')
        })
        .catch(()=>{
          this.errorNotify('Erro ao excluir tarefa')
        })
        })

      }
    }
  }
  </script>
