<template>
  <div>
    <Row>
      <Col span="8">
        <Card shadow style="margin: 5px">
          <chart-pie style="height: 300px" :value="pieData" text="需求状态分布"></chart-pie>
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
            <ListItem class="list-span-message" v-for="item in itemData" :key="item.title">
              <span style="margin-right: 20px;">{{ item.createdDate }}</span>
              <Tag color="blue">{{ item.assignerName }}</Tag>
              将&nbsp;<Tag color="geekblue">{{item.functionName}}</Tag>
              标记为&nbsp;<Tag color="green">{{item.functionStateName}}</Tag>
              状态
            </ListItem>
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
          <Button type="success" @click="openDrawer = true">新增需求</Button>
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

    <Drawer title="新增需求" width="360" :closable="true" :mask-closable="false" v-model="openDrawer">
      <Form ref="formValidateRef" :model="formData" :rules="ruleValidate">

        <FormItem label="所属项目" label-position="top" prop="projectId">
          <Select v-model="formData.projectId">
            <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="需求名称" label-position="top" prop="name">
          <Input v-model="formData.name" placeholder="请输入需求名称" show-word-limit/>
        </FormItem>

        <FormItem label="开发开始时间" label-position="top" prop="devStartTimeDate">
          <DatePicker v-model="formData.devStartTimeDate" type="datetime" placeholder="请输入项目开始开发时间"
                      style="width: 100%"></DatePicker>
        </FormItem>

        <FormItem label="测试开始时间" label-position="top" prop="testStartTimeDate">
          <DatePicker v-model="formData.testStartTimeDate" type="datetime" placeholder="请输入项目开始测试时间"
                      style="width: 100%"></DatePicker>
        </FormItem>

        <FormItem label="部署开始时间" label-position="top" prop="deployStartTimeDate">
          <DatePicker v-model="formData.deployStartTimeDate" type="datetime" placeholder="请输入项目开始部署时间"
                      style="width: 100%"></DatePicker>
        </FormItem>

        <FormItem label="项目结束" label-position="top" prop="deadlineDate">
          <DatePicker v-model="formData.deadlineDate" type="datetime" placeholder="请输入项目结束时间"
                      style="width: 100%"></DatePicker>
        </FormItem>

        <FormItem label="当前任务状态" label-position="top" prop="currentStateId">
          <Select v-model="formData.currentStateId">
            <Option v-for="item in functionStates" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="备注" label-position="top" prop = "remark">
          <Input v-model="formData.remark" placeholder="请输入备注信息"/>
        </FormItem>

      </Form>

      <Row>
        <Col span="12">
          <Button style="width: 90%" @click="handleReset('formValidateRef')">重置</Button>
        </Col>
        <Col span="12">
          <Button style="width: 90%" type="primary" @click="handleSubmit('formValidateRef')">提交</Button>
        </Col>
      </Row>
    </Drawer>
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
        openDrawer: false,
        formData: {},
        ruleValidate: {
          name: [
            { required: true, message: '需求名不能为空', trigger: 'blur' }
          ],
          devStartTimeDate: [
            { type: 'date', required: true, message: '开始开发时间不能为空', trigger: 'blur' }
          ],
          testStartTimeDate: [
            { type: 'date', required: true, message: '测试开始时间不能为空', trigger: 'blur' }
          ],
          deployStartTimeDate: [
            { type: 'date', required: true, message: '部署开始时间不能为空', trigger: 'blur' }
          ],
          deadlineDate: [
            { type: 'date', required: true, message: '结束时间不能为空', trigger: 'blur' }
          ],
          currentStateId: [
            { required: true, message: '当前任务状态不能为空', trigger: 'blur' }
          ]
        },
        itemData: [],
        pieData: [
          { value: 335, name: '开发' },
          { value: 310, name: '上线' },
          { value: 135, name: '回退' },
          { value: 234, name: '测试' }
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
        // 所有的项目列表，用于创建需求，指定项目
        projects: [],
        // 任务可能的所有的状态，用于下拉框
        functionStates: [],
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
            width: 130
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
            width: 150,
            render: (h, params) => {
              return h('span', {}, moment(params.row.devStartTime).format('YYYY-MM-DD hh:mm:ss'))
            }
          },
          {
            title: '开发结束',
            key: 'devDeadline',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('span', {}, moment(params.row.devDeadline).format('YYYY-MM-DD hh:mm:ss'))
            }
          },
          {
            title: '测试结束',
            key: 'testDeadline',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('span', {}, moment(params.row.testDeadline).format('YYYY-MM-DD hh:mm:ss'))
            }
          },
          {
            title: '上线',
            key: 'deadline',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('span', {}, moment(params.row.deadline).format('YYYY-MM-DD hh:mm:ss'))
            }
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
            width: 220,
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
      this.loadFunctionState()
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

      loadFunctionState () {
        api.getFunctionState({ p: 1, s: 2000, scs: 'priority(desc)' }).then((res) => {
          if (res.data.success) {
            this.functionStates = res.data.data
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

        let historyParam = {
          scs: 'created_date(desc)',
          s: '6'
        }
        api.getFunctionStateHistory(historyParam).then((res) => {
          if (res.data.success) {
            this.itemData = res.data.data
          }
        })
      },

      changePageIndex (page) {
        this.pc.pageIndex = page || 1
      },

      changePageSize (num) {
        this.pc.pageSize = parseInt(num)
      },

      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addFunction()
          } else {
            this.$Message.error('非法参数!')
          }
        })
      },

      handleReset (name) {
        this.$refs[name].resetFields()
      },

      addFunction () {
        this.formData.devStartTime = Date.parse(this.formData.devStartTimeDate)
        this.formData.testStartTime = Date.parse(this.formData.testStartTimeDate)
        this.formData.deployStartTime = Date.parse(this.formData.deployStartTimeDate)
        this.formData.deadline = Date.parse(this.formData.deadlineDate)

        api.createFunction(this.formData).then((res) => {
          if (res.data.success) {
            this.$Notice.success({
              title: '操作成功'
            })
            this.$refs['formValidateRef'].resetFields()
            this.openDrawer = false
          }
        })
      }
    }
  }
</script>

<style scoped>

  .list-span-message {
    color: #17233d;
    font-weight: bold;
  }
</style>
