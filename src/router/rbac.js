import Main from '@/components/main'

let rbac = {
  path: '/rbac',
  name: '权限管理',
  meta: {
    icon: 'md-menu',
    title: '权限管理'
  },
  component: Main,
  children: [
    {
      path: 'user/role',
      name: '用户角色',
      meta: {
        icon: 'md-funnel',
        title: '用户管理'
      },
      component: () => import('@/view/rbac/user-role.vue')
    },
    {
      path: 'role/permission',
      name: '角色权限',
      meta: {
        icon: 'md-funnel',
        title: '角色权限'
      },
      component: () => import('@/view/rbac/role-permission.vue')
    }
  ]
}
export default rbac
