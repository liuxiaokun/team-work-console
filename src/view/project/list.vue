<template>
  <div>
    <h1>project list</h1>

    <Card>
      <Table :columns="columns" stripe :data="data" border></Table>
      <div style="float: right;">
        <Page :total="100" :current="1"></Page>
      </div>
    </Card>
  </div>
</template>

<script>
  import * as projectApi from '@/api/project'

  export default {
    name: 'list',
    data () {
      return {
        columns: [
          {
            title: '项目名',
            key: 'name'
          },
          {
            title: '代码托管地址',
            render: (h, params) => {
              return h('a', {
                attrs: {
                  href: params.row.codeGitUrl,
                  target: '_blank'
                }
              }, params.row.codeGitUrl)
            }
          },
          {
            title: '启动时间',
            key: 'startTime',
            width: 150
          },
          {
            title: '完工时间',
            key: 'deadline',
            width: 150
          },
          {
            title: '备注',
            key: 'remark'
          },
          {
            title: '完成进度',
            width: 300,
            render: (h, params) => {
              return h('i-progress', {
                props: {
                  percent: '45',
                  'stroke-width': '22',
                  'status': 'success',
                  'text-inside':true,
                  'hide-info':true
                }
              })
            }
          },
        ],
        data: []
      }
    },
    created () {
      this.load()
    },

    methods: {
      load () {
        projectApi.getProjects().then((res) => {
          if (res.data.success) {
            console.log(res.data.data)
            this.data = res.data.data
            //this.pc = res.data.pc
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
