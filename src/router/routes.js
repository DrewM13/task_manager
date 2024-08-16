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
    children: [
      {
        path: '',
        component: () => import('pages/Project/Index.vue'),
        children:[
          {
            path: 'projects',
            name:'projects',
            component: () => import('pages/Project/List.vue'),
          },
          {
            path: ':id/tasks',
            name:'tasks',
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
