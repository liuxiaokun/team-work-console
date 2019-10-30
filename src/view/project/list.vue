<template>
  <div>
    <Card style="margin: 5px">
      <Row>
        <Col span="23">
          <Input v-model="filters.name" placeholder="输入项目名" style="width: 300px; margin-right: 18px"></Input>
          <Button type="primary" style="margin-right: 18px" @click="load()">搜索</Button>
        </Col>
        <Col span="1">
          <Button type="success" @click="addProject()">新增项目</Button>
        </Col>
      </Row>
    </Card>

    <Card style="margin: 5px">
      <Row>
        <Table :columns="columns" stripe :data="data" border></Table>
      </Row>

      <Row v-show="pc.total > 0">
        <Col>
          <Page :total="pc.total" :current="pc.pageIndex" show-total show-sizer @on-change="changePageIndex"
                style="float: right;margin: 10px;" :page-size-opts="[10,20,50,100]" :page-size="pc.pageSize"
                @on-page-size-change='changePageSize'></Page>
        </Col>
      </Row>

    </Card>

  </div>
</template>

<script>
  import * as projectApi from '@/api/project'

  export default {
    name: 'list',
    data () {
      return {
        filters: {
          name: ''
        },
        pc: {
          pageIndex: 1,
          pageSize: 20,
          total: 0
        },
        columns: [
          {
            title: '#',
            type: 'index',
            align: 'center',
            width: 50
          },
          {
            title: '项目名',
            key: 'name',
            align: 'center',
            width: 220
          },
          {
            title: '启动时间',
            key: 'startTime',
            align: 'center',
            width: 200
          },
          {
            title: '完工时间',
            key: 'deadline',
            align: 'center',
            width: 200
          },
          {
            title: '完成进度',
            width: 200,
            render: (h, params) => {
              return h('i-progress', {
                props: {
                  percent: params.row.completePercent,
                  'stroke-width': 22,
                  'status': 'active',
                  'text-inside': true,
                  'hide-info': true
                }
              })
            }
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
            title: '备注',
            key: 'remark'
          },
        ],
        data: []
      }
    },
    created () {
      this.load()
    },

    watch: {
      'pc.pageIndex': function (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.load()
        }
      },
      'pc.pageSize': function (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.load()
        }
      }
    },

    methods: {
      load () {
        let paging = {
          p: this.pc.pageIndex,
          s: this.pc.pageSize
        }

        let params = Object.assign({}, paging, this.filters)
        projectApi.getProjects(params).then((res) => {
          if (res.data.success) {
            this.data = res.data.data
            this.pc = res.data.pc
          }
        })
      },

      addProject() {
        this.$router.push({
          path: '/project/add',
          query: {id: 0}
        })
      },

      changePageIndex (page) {
        this.pc.pageIndex = page || 1
      },

      changePageSize (num) {
        this.pc.pageSize = parseInt(num)
      },
    }
  }
</script>

<style scoped>

</style>
