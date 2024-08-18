<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Gerenciador de tarefas
        </q-toolbar-title>
        <div class='text-right'>
        <q-btn-dropdown
          flat
          dense
          round
          icon="account_circle"
        >
      <q-list dense>
        <q-item clickable v-ripple @click='logout()'>
          <q-item-section >
            Sair
          </q-item-section>
        </q-item>
      </q-list>
      </q-btn-dropdown>
      </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list bordered>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container  >

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Dashboard',
    icon: 'space_dashboard',
    link: 'dashboard'
  },
   {
    title: 'Projetos',
    icon: 'view_timeline',
    link: 'projects'
  }
]

export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  methods:{
      logout(){
        localStorage.removeItem('jwtoken')
        this.$router.push('/login')
      }
    }
}
</script>
