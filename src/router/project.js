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
    }
  ]
}
export default project
