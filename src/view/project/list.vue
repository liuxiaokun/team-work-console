<template>
  <div>
    <Card style="margin: 5px">
      <Row>
        <Col span="23">
          <Input v-model="filters.name" placeholder="输入项目名" style="width: 300px; margin-right: 18px"></Input>
          <Button type="primary" style="margin-right: 18px" @click="load()">搜索</Button>
        </Col>
        <Col span="1">
          <Button type="success" @click="openDrawer = true">新增项目</Button>
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

    <Drawer title="创建项目" width="360" :closable="true" :mask-closable="false" v-model="openDrawer">
      <Form ref="formValidateRef" :model="formData" :rules="ruleValidate">
        <FormItem label="项目名" label-position="top" prop="name">
          <Input v-model="formData.name" placeholder="请输入项目名" show-word-limit/>
        </FormItem>

        <FormItem label="Git代码地址" label-position="top" prop="codeGitUrl">
          <Input v-model="formData.codeGitUrl" placeholder="请输入Git代码地址"/>
        </FormItem>

        <FormItem label="项目开始" label-position="top" prop="startTimeDate">
          <DatePicker v-model="formData.startTimeDate" type="datetime" placeholder="请输入项目开始时间"
                      style="width: 100%"></DatePicker>
        </FormItem>

        <FormItem label="项目结束" label-position="top" prop="deadlineDate">
          <DatePicker v-model="formData.deadlineDate" type="datetime" placeholder="请输入项目结束时间"
                      style="width: 100%"></DatePicker>
        </FormItem>

        <FormItem label="备注" label-position="top">
          <Input v-model="formData.remark" placeholder="请输入备注信息"/>
        </FormItem>

        <FormItem label="描述" label-position="top">
          <Input v-model="formData.desc" type="textarea" placeholder="请输入备注信息"/>
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
  import * as projectApi from '@/api/project'

  export default {
    name: 'list',
    data () {
      return {
        openDrawer: false,
        ruleValidate: {
          name: [
            { required: true, message: '项目名不能为空', trigger: 'blur' }
          ],
          codeGitUrl: [
            { required: true, message: '项目名不能为空', trigger: 'blur' }
          ],
          startTimeDate: [
            { type: 'date', required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          deadlineDate: [
            { type: 'date', required: true, message: '结束时间不能为空', trigger: 'blur' }
          ]
        },
        formData: {
          name: '',
          codeGitUrl: '',
          remark: '',
          desc: '',
          startTime: '',
          startTimeDate: '',
          deadline: '',
          deadlineDate: ''
        },

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
          }
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

      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.addProject()
          } else {
            this.$Message.error('非法参数!')
          }
        })
      },

      handleReset (name) {
        this.$refs[name].resetFields()
      },

      addProject () {
        this.formData.deadline = Date.parse(this.formData.deadlineDate)
        this.formData.startTime = Date.parse(this.formData.startTimeDate)

        projectApi.createProject(this.formData).then((res) => {
          if (res.data.success) {
            this.$Notice.success({
              title: '操作成功'
            })
            this.$refs[name].resetFields()
            this.openDrawer = false
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

</style>
