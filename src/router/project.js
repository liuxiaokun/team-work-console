import Main from '@/components/main'

let project = {
  path: '/project',
  name: '项目',
  meta: {
    icon: 'md-menu',
    title: '项目'
  },
  component: Main,
  children: [
    {
      path: 'list',
      name: '项目列表',
      meta: {
        icon: 'md-funnel',
        title: '项目列表'
      },
      component: () => import('@/view/project/list.vue')
    },
    {
      path: 'add',
      name: '新增项目',
      meta: {
        icon: 'md-funnel',
        hideInMenu: true,
        title: '新增项目'
      },
      component: () => import('@/view/project/editor.vue')
    },
    {
      path: 'update',
      name: '修改项目',
      meta: {
        icon: 'md-funnel',
        hideInMenu: true,
        title: '修改项目'
      },
      component: () => import('@/view/project/update.vue')
    }
  ]
}
export default project
