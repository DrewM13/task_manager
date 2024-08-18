<template>
  <q-card class="q-ma-md " style="height: 90vh ;">
    <q-card-section class='row'>
      <div class='col text-bold text-h5'>
        <q-icon name="task" size='md'/>
        Tarefas
      </div>
      <div class='text-right col'>
        <q-btn color="green" text-color="white" label="Adicionar" icon='add' rounded @click="addDialog = true"/>
      </div>
    </q-card-section>
    <q-separator  />
  <q-card-section v-if='dataList.length' class='row q-gutter-md full-width'>
    <q-table  :data="dataList" :columns="columns" class='full-width' row-key="idTask" :filter="filter" separator='cell' flat bordered>
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
        <q-item clickable v-ripple v-close-popup @click="getTimeTracked(props.row.idTask); taskData = props.row" v-if='props.row.vchCollaboratorName !== null'>
          <q-item-section avatar>
            <q-icon color="grey" name="timer" />
          </q-item-section>
          <q-item-section>Tempo gasto</q-item-section>
        </q-item>
         <q-item clickable v-ripple v-close-popup @click="taskData = props.row; getTimeTrackedToView(props.row.idTask)">
          <q-item-section avatar>
            <q-icon color="indigo" name="preview" />
          </q-item-section>
          <q-item-section>Visualizar</q-item-section>
        </q-item>
          <q-item clickable v-ripple v-close-popup @click="editDialog = true; editData = {...props.row}; originalData = props.row">
          <q-item-section avatar>
            <q-icon color="amber" name="edit" />
          </q-item-section>
          <q-item-section>Editar</q-item-section>
        </q-item>
        <q-item clickable v-ripple v-close-popup @click='deleteTask(props.row)'>
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
       <q-btn color="red" icon='close' dense size='md' flat rounded @click='viewDialog = false'>
        <q-tooltip>
          Fechar
        </q-tooltip>
       </q-btn>

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
  Data de criação:
</div>
<div class='col text-right'>
  {{formatDate(taskData.dtmCreatedAt) }}
</div>

      </q-card-section>
      <q-separator/>
      <q-card-section class='row items-center col-2'>
<div class='col text-bold text-left'>
  Data de atualização:
</div>
<div class='col text-right'>
  {{ formatDate(taskData.dtmUpdatedAt) }}
</div>

      </q-card-section>
<q-card-section class='column  col'>
<div class='col-12  row'>
  <div class='text-left col text-bold'>
    Tempos rastreados:
  </div>
  <div class='text-right col'>
    {{ totalTime }}
  </div>
</div>
<div class='col text-right'>
 <q-list separator dense bordered  v-if='timeList.length' class='rounded-borders'>
  <q-item v-for='(time, idx) in timeList' :key='idx' class='items-center justify-center'>
      {{ time }}
  </q-item>
 </q-list>
 <div v-else class='text-center'>
  Não há tempos rastreados para essa tarefa
 </div>
</div>

      </q-card-section>
  </q-card>
  </q-dialog>
<!-- Rastreador -->
<q-dialog v-model="timerDialog" persistent>
<q-card  class=' full-width'>
<q-card-section class='row'>
<div class="text-h6 col"><q-icon name="timelapse" />
 Tempo rastreado na tarefa</div>
<div class="text-h6 text-right col-3"> {{ totalTime }}</div>
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
        v-model="timeZoneFormat"
        :options="timeZoneOptions"
         @filter="filterFn"
         use-input
        input-debounce="0"
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
      <q-btn color="red" outline round icon='close' size='sm' @click='deleteTime(idx)'>
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
<q-btn :disable='!timeList.length' label="Salvar" color="primary" @click='createTimeTask(timeZoneFormat)' no-caps rounded />
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
  import TaskService from 'src/services/TaskService';
  import CollaboratorService from 'src/services/CollaboratorService';
  import TimeTrackerService from 'src/services/TimeTrackerService';
  import Notify from 'src/mixins/notify'
  import date from 'src/mixins/date'
  import { DateTime } from 'luxon'
  const timeZoneList = Intl.supportedValuesOf('timeZone');
  export default {
    mixins: [Notify, date],
    data () {
      return {
        TaskService: new TaskService(),
        CollaboratorService: new CollaboratorService(),
        TimeTrackerService: new TimeTrackerService(),
        dataList: [],
        filter: '',
        columns: [
          {
            name: 'vchTaskName',
            label: 'Nome',
            field: 'vchTaskName',
            align: 'left'
          },
          {
            name: 'vchDescription',
            label: 'Descrição',
            field: 'vchDescription',
            align: 'left'
          },
          {
            name: 'vchCollaboratorName',
            label: 'Responsável',
            field: 'vchCollaboratorName',
            align: 'left',
            format: (val) => { return val || 'Sem atribuição' }
          },
          {
            name: 'dtmCreatedAt',
            label: 'Data de criação',
            field: 'dtmCreatedAt',
            align: 'center',
            format: (val) => { return this.formatDate(val) }
          },
          {
            name: 'dtmUpdatedAt',
            label: 'Data de atualização',
            field: 'dtmUpdatedAt',
            align: 'center',
            format: (val) => { return this.formatDate(val) }
          },
          {
            name: 'actions',
            label: 'Ações',
            field: 'actions',
            align: 'right',
            style: 'width: 10px'
          },
        ],
        taskData: {},
        editData: {},
        originalData: {},
        addData: {},
        editDialog: false,
        addDialog: false,
        viewDialog: false,
        timerDialog: false,
        timerRunning: false,
        isInputTime: false,
        timeList: [],
        timeTraked: [],
        collaboratorsOpt: [],
        timesToDelete: [],
        timer: null,
        timeInput: '00:00:00',
        timeZoneFormat: 'America/Sao_Paulo',
        timeZoneOptions: timeZoneList,
        startTime: null,
        startTimeInput: null,
        endTime: null,
        endTimeInput: null,
        isLoading: false,
      }
    },
    mounted () {
      this.getTasks()
      this.getCollaboratos()
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    computed: {
      totalTime () {
        return this.getTotalTime(this.timeList)
      },
      isAddButtonDisabled () {
        const totalSecondsInInput = this.calculateSeconds(this.timeInput);
        const maxSeconds = 86400;
        return (
          this.totalTime >= maxSeconds ||
          this.totalTime + totalSecondsInInput > maxSeconds
        );
      }
    },
    methods: {
      validateInput () {
        const isNull = this.startTimeInput == null || this.endTimeInput == null
        const isEmpty = this.startTimeInput == '' || this.endTimeInput == ''
        return isNull || isEmpty
      },
      getTasks () {
        this.isLoading = true
        this.TaskService.GetByIDProject(this.$route.params.id)
          .then((res) => {
            this.dataList = res
            this.isLoading = false
          })
          .catch((err) => {
            this.errorNotify(err.message)
            this.isLoading = false
          })
      },
      getCollaboratos () {
        this.CollaboratorService.list()
          .then((res) => {
            this.collaboratorsOpt = res.map(item => {
              return {
                value: item.idCollaborator,
                label: item.vchCollaboratorName
              }
            })
          })
          .catch((err) => {
            this.errorNotify(err.message)
          })
      },
      getTimeTracked (idTask) {
        this.TimeTrackerService.getByIDTask(idTask)
          .then((res) => {
            this.timeTraked = [...res]
            this.timeList = res.map(item => {
              this.timeZoneFormat = item.vchTimeZoneID
              const formattedStart = this.formatDateTimeFromBack(item.dtmStart, item.vchTimeZoneID);
              const formattedEnd = this.formatDateTimeFromBack(item.dtmEnd, item.vchTimeZoneID);
              const entry = `${formattedStart} - ${formattedEnd}`;
              return entry
            })
            this.timerDialog = true;
          }).catch(() => {
            this.errorNotify('Erro ao listar tempos rastreados')
          })
      },
      getTimeTrackedToView (idTask) {
        this.isLoading = true
        this.TimeTrackerService.getByIDTask(idTask)
          .then((res) => {
            this.timeList = res.map(item => {
              this.timeZoneFormat = item.vchTimeZoneID
              const formattedStart = this.formatDateTimeFromBack(item.dtmStart, item.vchTimeZoneID)
              const formattedEnd = this.formatDateTimeFromBack(item.dtmEnd, item.vchTimeZoneID)
              const entry = `${formattedStart} - ${formattedEnd}`
              return entry
            })
            this.isLoading = false
            this.viewDialog = true
          }).catch(() => {
            this.errorNotify('Erro ao listar tempos rastreados')
            this.isLoading = false
          })
      },
      toggleTimer () {
        if (this.timerRunning) {
          clearInterval(this.timer);
          this.timerRunning = false;
          this.endTime = new Date();
        } else {
          this.startTimer();
        }
      },
      startTimer () {
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
      addTimeByInput () {
        if (this.startTimeInput && this.endTimeInput) {
          this.startTime = this.convertToDateTime(this.startTimeInput, this.timeZoneFormat)
          this.endTime = this.convertToDateTime(this.endTimeInput, this.timeZoneFormat)
          const formattedStart = this.formatDateTime(this.startTime, this.timeZoneFormat);
          const formattedEnd = this.formatDateTime(this.endTime, this.timeZoneFormat);
          const entry = `${formattedStart} - ${formattedEnd}`;

          if (this.timeList.some(entry => entry.trim() === `${formattedStart} - ${formattedEnd}`)) {
            this.errorNotify('O intervalo já existe!')
          }
          else if (this.isOverlapping(formattedStart, formattedEnd)) {
            this.errorNotify('O intervalo não deve sobrepôr intervalos existentes!')
          }
          else {
            this.timeTraked.push({ dtmStart: formattedStart, dtmEnd: formattedEnd })
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
      addTime () {
        if (this.startTime && this.endTime && !this.isAddButtonDisabled) {
          const formattedStart = this.formatDateTime(this.startTime, this.timeZoneFormat);
          const formattedEnd = this.formatDateTime(this.endTime, this.timeZoneFormat);
          const entry = `${formattedStart} - ${formattedEnd}`;
          if (this.isOverlapping(formattedStart, formattedEnd)) {
            this.errorNotify('O intervalo não deve sobrepôr intervalos existentes!')
          }
          else if (this.timeList.some(entry => entry.trim() === `${formattedStart} - ${formattedEnd}`)) {
            this.errorNotify('O intervalo já existe!')
          }
          else {
            this.timeTraked.push({ dtmStart: formattedStart, dtmEnd: formattedEnd })
            this.timeList.push(entry);
            this.timeInput = '00:00:00';
            this.startTime = null;
            this.endTime = null;
            this.totalSeconds = 0;
          }
        }
      },
      isOverlapping (newStart, newEnd) {
        const isOverlapping = this.timeList.some(entry => {
          const [start, end] = entry.split(' - ').map(time => time.trim());
          return (newStart < end && newEnd > start);
        });
        return isOverlapping
      },
      deleteTime (position) {
        if (this.timeTraked[position].idTimeTracker != undefined) {
          this.timesToDelete.push(this.timeTraked[position])
        }
        this.timeTraked.splice(position, 1)
        this.timeList.splice(position, 1)
      },
      reset () {
        this.timeList = []
        this.timeTraked = []
        this.timeInput = '00:00:00'
      },
      editTask (data, originalData) {
        const sendObj = {
          vchTaskName: data.vchTaskName,
          idTask: data.idTask,
          vchDescription: data.vchDescription,
        }
        this.TaskService.update(sendObj)
          .then(() => {
            if (data.idCollaborator) {
              if (originalData.idCollaborator != data.idCollaborator) {
                this.$q.dialog({
                  title: 'Atenção',
                  message: `O responsável ${originalData.vchCollaboratorName} pode ter tempos rastreados nessa tarefa, eles serão removidos, deseja continuar?`,

                  cancel: true,
                  persistent: true,
                  cancel: { color: 'grey', outline: true, noCaps: true },
                  ok: { color: 'red', noCaps: true }

                }).onOk(() => {
                  this.addOrEditCollaboratorToTask(data.idTask, data.idCollaborator)
                })
              } else {
                this.addOrEditCollaboratorToTask(data.idTask, data.idCollaborator)
              }
            } else {
              this.getTasks()
              this.editDialog = false
              this.successNotify(`Tarefa ${data.vchTaskName} editada com sucesso!`)
            }

          })
          .catch((err) => {
            this.errorNotify('Erro ao editar projeto: ' + err.message)
          })

      },
      addTask (data) {
        const sendObj = {
          vchTaskName: data.vchTaskName,
          vchDescription: data.vchDescription,
          idProject: this.$route.params.id
        }
        this.TaskService.create(sendObj)
          .then((res) => {

            if (data.idCollaborator) {
              this.addOrEditCollaboratorToTask(res.idTask, data.idCollaborator)
            } else {
              this.getTasks()
              this.addDialog = false
              this.successNotify(`Tarefa ${data.vchTaskName} criada com sucesso!`)
            }


          })
          .catch((err) => {
            this.errorNotify('Erro ao criar tarefa: ' + err.message)
          })

      },
      addOrEditCollaboratorToTask (idTask, idCollaborator) {
        const objToSend = {
          idTask: idTask,
          idCollaborator: idCollaborator
        }

        this.CollaboratorService.create(objToSend)
          .then(() => {
            this.getTasks()
            this.addDialog = false
            this.editDialog = false
          })
          .catch((err) => {
            this.errorNotify('Erro ao criar ou editar associação: ' + err.message)
          })
      },
      createTimeTask (timeZoneFormat) {
        const arrayData = this.timeTraked.filter(item => !item.idTimeTracker).map((data) => {
          let dtmStart = null
          let dtmEnd = null
          dtmStart = this.formatToSendToBack(data.dtmStart, timeZoneFormat)
          dtmEnd = this.formatToSendToBack(data.dtmEnd, timeZoneFormat)
          data.vchTimeZoneID = timeZoneFormat,
            data.idTask = this.taskData.idTask,
            data.idCollaborator = this.taskData.idCollaborator,
            data.dtmStart = dtmStart,
            data.dtmEnd = dtmEnd
          return data
        })
        this.TimeTrackerService.create(arrayData)
          .then(() => {
            this.successNotify('Rastreamento de tempo criado com sucesso')

          }).catch(() => {
            this.errorNotify('Erro ao criar rastreamento de tempo')
          })
        this.deleteTimeTracker()

      },
      deleteTimeTracker () {
        if (this.timesToDelete.length) {
          this.TimeTrackerService.remove(this.timesToDelete)
            .then(() => {
              this.successNotify('Rastreamento de tempo removido com sucesso')

            }).catch(() => {
              this.errorNotify('Erro ao remover rastreamento de tempo')
            })
        }
        this.getTasks()
        this.timerDialog = false
      },
      deleteTask (data) {
        this.$q.dialog({
          title: 'Atenção',
          message: `Deseja remover o tarefa ${data.vchTaskName}?`,

          cancel: true,
          persistent: true,
          cancel: { color: 'grey', outline: true, noCaps: true },
          ok: { color: 'red', noCaps: true }

        }).onOk(() => {
          this.TaskService.remove(data.idTask)
            .then(() => {
              this.getTasks()
              this.successNotify('Tarefa excluída com sucesso')
            })
            .catch(() => {
              this.errorNotify('Erro ao excluir tarefa')
            })
        })

      },
      filterFn (val, update) {
        if (val === '') {
          update(() => {
            this.timeZoneOptions = timeZoneList
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          this.timeZoneOptions = timeZoneList.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
      }
    }
  }
  </script>
