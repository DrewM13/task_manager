const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/Login.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: 'dashboard',
    children: [
      {
         path:'dashboard',
         name:'dashboard',
         meta: {
          breadCrumb: 'Início'
        },
         component: () => import('pages/DashBoard.vue')
      },
      {
        path: 'projects',
        meta: {
          breadCrumb: 'Projetos'
        },
        component: () => import('pages/Project/Index.vue'),
        children:[
          {
            path: '',
            name:'projects',
            component: () => import('pages/Project/List.vue'),
          },
          {
            path: ':id/tasks',
            name:'tasks',
            meta: {
              breadCrumb: 'Tarefas'
            },
            component: () => import('pages/Task/Index.vue'),
            children:[
              {
                path: '',
                name:'tasks',
                component: () => import('pages/Task/List.vue')
              }
            ]
          }


        ]
       },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
