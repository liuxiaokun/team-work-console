<template>
  <div>
    <Row>
      <Col span="4">
        <Card>组织架构</Card>
        <Card>
          <Tree :data="orgData" ref="orgTree" @on-select-change="findOrgUsers"></Tree>
        </Card>
      </Col>
      <Col span="20">
        <Card>
          <Table :columns="columns" :data="tableData"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

  import * as rbac from '@/api/rbac'

  export default {
    name: 'user-role',
    data () {
      return {
        orgData: [],

        columns: [
          {
            title: '名字',
            key: 'name'
          },
          {
            title: '手机号',
            key: 'mobile'
          },
          {
            title: '昵称',
            key: 'nickname'
          },
          {
            title: '邮箱',
            key: 'email'
          }
          /* {
            title: '角色',
            minWidth: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, [
                params.row.roleNames.map((val) => {
                  return h('Tag', {
                    props: {
                      color: 'primary'
                    }
                  }, val)
                })
              ])
            }
          }, */
        ],
        tableData: [],
        userParams: {
          orgId:0
        }
      }
    },

    created () {
      this.load()
    },

    methods: {
      load () {
        rbac.getOrgTree().then((res) => {
          this.orgData = res.data.data
        })

        rbac.getOrgUser({"id":0}).then((res) => {
          this.tableData = res.data.data
        })
      },

      findOrgUsers: function (data) {
        console.log(data)
        let choicesAll = this.$refs.orgTree.getCheckedNodes
        // 方法的运用 getSelectedNodes也是如此用法
        console.log(choicesAll)

        rbac.getOrgUser({"id": data[0].id}).then((res) => {
          this.tableData = res.data.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
