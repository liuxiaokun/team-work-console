<template>
  <div>
    <Row>
      <Col span="8">
        <Card shadow style="margin: 5px">
          <chart-pie style="height: 300px"  :value="pieData" text="需求状态分布"></chart-pie>
        </Card>
      </Col>
      <Col span="8">
        <Card style="margin: 5px">
          <chart-bar style="height: 300px;" :value="barData" text="每天任务完成量"/>
        </Card>
      </Col>

      <Col span="8">
        <Card style="margin: 5px">
          <List style="height: 300px">
            <ListItem><span class="list-span-message">2019-09-09 10:21:21 </span>王迁完成了android端系统推送</ListItem>
            <ListItem><span class="list-span-message">2019-09-09 10:22:21 </span>张杰完成了ios端系统推送</ListItem>
            <ListItem><span class="list-span-message">2019-09-09 10:23:21 </span>邹广鹏完成了后台推送功能</ListItem>
            <ListItem><span class="list-span-message">2019-09-09 10:24:21 </span>邹广鹏完成了后台推送功能</ListItem>
            <ListItem><span class="list-span-message">2019-09-09 10:25:21 </span>邹广鹏完成了后台推送功能</ListItem>
            <ListItem><span class="list-span-message">2019-09-09 10:26:21 </span>邹广鹏完成了后台推送功能</ListItem>
            <ListItem><span class="list-span-message">2019-09-09 10:27:21 </span>邹广鹏完成了后台推送功能</ListItem>
          </List>
        </Card>
      </Col>
    </Row>

    <Card style="margin: 5px">
      <Row>
        <Col span="23">
          <Input v-model="filters.name" placeholder="输入需求名" style="width: 300px; margin-right: 18px"></Input>

          <Select v-model="filters.projectId" style="width: 200px">
            <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>

          <Button type="primary" style="margin-left: 18px" @click="load()">搜索</Button>
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
import * as projectApi from '@/api/project'
import moment from 'moment'
import { ChartPie, ChartBar } from '_c/charts'

export default {
  name: 'list',
  components: {
    ChartPie,
    ChartBar
  },
  data () {
    return {
      pieData: [
        { value: 335, name: '开发中' },
        { value: 310, name: '测试中' },
        { value: 234, name: '上线' },
        { value: 135, name: '回退' }
      ],

      barData: {
        Mon: 22,
        Tue: 33,
        Wed: 22,
        Thu: 25,
        Fri: 43,
        Sat: 27,
        Sun: 65
      },

      filters: {
        name: '',
        projectId: ''
      },
      projects: [],
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
          title: '所属项目',
          key: 'projectName',
          align: 'center',
          width: 220
        },
        {
          title: '名字',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.$router.push({
                    path: '/function/view',
                    query: { id: params.row.id }
                  })
                }
              }
            }, params.row.name)
          }
        },
        {
          title: '开发开始',
          key: 'devStartTime',
          align: 'center',
          width: 200
        },
        {
          title: '开发结束',
          key: 'devDeadline',
          align: 'center',
          width: 200
        },
        {
          title: '测试结束',
          key: 'testDeadline',
          align: 'center',
          width: 200
        },
        {
          title: '上线',
          key: 'deadline',
          align: 'center',
          width: 200
        },
        {
          title: '状态',
          key: 'currentStateName',
          width: 120,
          render: (h, params) => {
            let color = params.row.currentStateName === '上线完成' ? 'success' : 'warning'
            return h('Tag', {
              props: {
                'color': color
              }
            }, params.row.currentStateName)
          }
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '时间消耗',
          width: 300,
          render: (h, params) => {
            return h('i-progress', {
              props: {
                percent: params.row.timeCostPercent,
                'stroke-width': 22,
                'status': 'success',
                'text-inside': true,
                'hide-info': true
              }
            })
          }
        }
      ],
      data: []
    }
  },

  created () {
    this.loadProject()
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
    currentDate () {
      return moment.format('YYYY-MM-DD hh:mm:ss')
    },
    loadProject () {
      projectApi.getProjects({ p: 1, s: 2000 }).then((res) => {
        if (res.data.success) {
          this.projects = res.data.data
        }
      })
    },
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
    }
  }
}
</script>

<style scoped>

  .list-span-message {
    margin-right: 30px;
    color: #2d8cf0;
    font-weight: bold;
  }
</style>
