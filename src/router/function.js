import Main from '@/components/main'

let project = {
  path: '/function',
  name: '项目',
  meta: {
    icon: 'md-menu',
    title: '需求'
  },
  component: Main,
  children: [
    {
      path: 'list',
      name: '需求列表',
      meta: {
        icon: 'md-funnel',
        title: '需求列表'
      },
      component: () => import('@/view/function/list.vue')
    }
  ]
}
export default project
