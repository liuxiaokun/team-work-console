<template>
  <div>
    <Card style="margin: 5px">
      <Row>
        <Col span="23">
          <Input v-model="filters.name" placeholder="输入需求名" style="width: 300px; margin-right: 18px"></Input>
          <Button type="primary" style="margin-right: 18px" @click="load()">搜索</Button>
        </Col>
        <Col span="1">
          <Button type="success">新增需求</Button>
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
  import * as api from '@/api/function'

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
            title: '编号',
            type: 'index'
          },
          {
            title: '名字',
            key: 'name'
          },
          {
            title: '开发开始',
            key: 'devStartTime',
            width: 150
          },
          {
            title: '开发结束',
            key: 'devDeadline',
            width: 150
          },
          {
            title: '测试结束',
            key: 'testDeadline',
            width: 150
          },
          {
            title: '上线',
            key: 'deadline',
            width: 150
          },
          {
            title: '状态',
            key: 'currentStateName',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  'color': 'success'
                }
              }, params.row.currentStateName)
            }
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
                  percent: params.row.completePercent,
                  'stroke-width': 22,
                  'status': 'success',
                  'text-inside': true,
                  'hide-info': true
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
        api.getFunctions(params).then((res) => {
          if (res.data.success) {
            this.data = res.data.data
            this.pc = res.data.pc
          }
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
