<template>
  <div>
    <Row>
      <Col span="10">
        <Card>
          <List>
            <ListItem>
              <ListItemMeta title="所属项目" :description="data.projectName"/>
            </ListItem>
            <ListItem>
              <ListItemMeta title="需求名称" :description="data.name"/>
            </ListItem>
            <ListItem>
              <ListItemMeta title="当前状态" :description="data.currentStateName"/>
            </ListItem>
            <ListItem>
              <ListItemMeta title="当前处理人" :description="data.currentHandlePerson"/>
            </ListItem>
            <ListItem>
              <ListItemMeta title="详细描述" :description="data.desc"/>
            </ListItem>
            <ListItem>
              <ListItemMeta title="创建时间" :description="data.createdDate"/>
            </ListItem>
            <ListItem>
              <ListItemMeta title="创建人" :description="data.createdName"/>
            </ListItem>
          </List>
        </Card>

        <Row>
          <Col span="12">
            <Select v-model="assigner" placeholder="请指派负责人" :disabled="disable">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Col>
          <Col span="12">
            <Button @click="markState()" type="primary" :disabled="disable" long>{{buttonName}}
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span="6">
        <Card style="margin-left: 5px; font-weight: bold; font-size: 16px">
          异常检查
        </Card>
        <Card style="margin-left: 5px;">
          <div style="height: 300px;">
            <List style="height: 300px">
              <ListItem>开发过程超时 <span style="margin-left: 60px">责任人: 张三</span></ListItem>
              <ListItem>测试过程超时 <span style="margin-left: 60px">责任人: 张三</span></ListItem>
              <ListItem>上线过程超时 <span style="margin-left: 60px">责任人: 张三</span></ListItem>
              <ListItem>上线过程超时 <span style="margin-left: 60px">责任人: 张三</span></ListItem>
              <ListItem>验收正常 <span style="margin-left: 86px">责任人: 张三</span></ListItem>
            </List>
          </div>
        </Card>
      </Col>
      <Col span="4">
        <Card style="margin-left: 5px; font-weight: bold; font-size: 16px">
          进度占比
        </Card>
        <Card style="margin-left: 5px;">
          <div style="height: 300px;">
            <div style="padding-bottom: 10px;">时间消耗</div>
            <Progress :percent="this.data.timeCostPercent" status="active" :stroke-width="25"/>
            <div style="padding-bottom: 10px; padding-top: 10px;">完成进度</div>
            <Progress :percent="this.data.completePercent" :stroke-width="25" style/>
          </div>
        </Card>
      </Col>
      <Col span="4">
        <Card style="margin-left: 5px; font-weight: bold; font-size: 16px">
          计划进度
        </Card>
        <Card style="margin-left: 5px">
          <Timeline>
            <TimelineItem color="green">
              <Icon type="md-create" slot="dot"></Icon>
              <p class="time">{{data.createdDate}}</p>
              <p class="content">提出需求</p>
            </TimelineItem>
            <TimelineItem :color="devStartTimeColor">
              <Icon type="logo-codepen" slot="dot"></Icon>
              <p class="time">{{data.devStartTimeFormat}}</p>
              <p class="content">开发中</p>
            </TimelineItem>
            <TimelineItem :color="testStartTimeColor">
              <Icon type="logo-foursquare" slot="dot"></Icon>
              <p class="time">{{data.testStartTimeFormat}}</p>
              <p class="content">测试中</p>
            </TimelineItem>
            <TimelineItem :color="deployStartTimeColor">
              <Icon type="md-cloud" slot="dot"></Icon>
              <p class="time">{{data.deployStartTimeFormat}}</p>
              <p class="content">上线中</p>
            </TimelineItem>
            <TimelineItem :color="deadlineColor">
              <Icon type="md-checkmark-circle" slot="dot"></Icon>
              <p class="time">{{data.deadlineFormat}}</p>
              <p class="content">上线发布</p>
            </TimelineItem>
          </Timeline>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import * as api from '@/api/function'
  import * as rbacApi from '@/api/rbac'
  import moment from 'moment'

  export default {
    name: 'function-view',

    data () {
      return {
        assigner: 0,
        userList: [],
        disable: false,
        buttonName: '将标记状态为 ',
        colorGray: '#999999',
        devStartTimeColor: '#999999',
        testStartTimeColor: '#999999',
        deployStartTimeColor: '#999999',
        deadlineColor: '#999999',
        data: {},
        nextFunctionState: {}
      }
    },

    created () {
      this.load({})
    },

    methods: {
      markState () {
        if (this.assigner === 0) {
          this.$Notice.error({
            title: '请选择负责人'
          })
          return
        }
        let params = {
          'id': this.data.id,
          'current_state_id': this.nextFunctionState.id,
          'current_state_name': this.nextFunctionState.name,
          'assigner': this.assigner
        }
        api.updatexFunction(params).then((res) => {
          if (res.data.success) {
            this.$Notice.success({
              title: '操作成功'
            })
            this.disable = true
            this.load({})
          }
        })
      },
      load (params) {
        let time = new Date().getTime()
        params.id = this.$route.query.id
        api.getFunction(params).then((res) => {
          if (res.data.success) {
            this.data = res.data.data
            let param = {
              currentStateId: this.data.currentStateId
            }
            this.nextState(param)

            if (time > this.data.deadline) {
              this.devStartTimeColor = 'green'
              this.testStartTimeColor = 'green'
              this.deployStartTimeColor = 'green'
              this.deadlineColor = 'green'
            } else if (time > this.data.deployStartTime) {
              this.devStartTimeColor = 'green'
              this.testStartTimeColor = 'green'
              this.deployStartTimeColor = 'green'
              this.deadlineColor = 'blue'
            } else if (time > this.data.testStartTime) {
              this.devStartTimeColor = 'green'
              this.testStartTimeColor = 'green'
              this.deployStartTimeColor = 'blue'
              this.deadlineColor = this.colorGray
            } else if (time > this.data.devStartTime) {
              this.devStartTimeColor = 'green'
              this.testStartTimeColor = 'blue'
              this.deployStartTimeColor = this.colorGray
              this.deadlineColor = this.colorGray
            } else {
              this.devStartTimeColor = this.colorGray
              this.testStartTimeColor = this.colorGray
              this.deployStartTimeColor = this.colorGray
              this.deadlineColor = this.colorGray
            }
            this.data.devStartTimeFormat = moment(this.data.devStartTime).format('YYYY-MM-DD hh:mm:ss')
            this.data.testStartTimeFormat = moment(this.data.testStartTime).format('YYYY-MM-DD hh:mm:ss')
            this.data.deployStartTimeFormat = moment(this.data.deployStartTime).format('YYYY-MM-DD hh:mm:ss')
            this.data.deadlineFormat = moment(this.data.deadline).format('YYYY-MM-DD hh:mm:ss')
          }
        })

        let userParams = { s: 100 }
        this.loadUserList(userParams)
      },

      nextState (params) {
        api.getNextFunctionState(params).then((res) => {
          if (res.data.success) {
            if (res.data.data.id === null || res.data.data.id === undefined) {
              this.buttonName = '结束'
              this.disable = true
            } else {
              this.nextFunctionState = res.data.data
              this.buttonName = this.buttonName + res.data.data.name
            }
          }
        })
      },

      loadUserList (params) {
        rbacApi.getUser(params).then((res) => {
          if (res.data.success) {
            this.userList = res.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>
  .time {
    font-size: 16px;
    font-weight: bold;
    padding-left: 5px;
  }

  .content {
    font-size: 14px;
    padding-top: 5px;
    padding-left: 10px;
    margin-bottom: 20px;
  }

</style>
