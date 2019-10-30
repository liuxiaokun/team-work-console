<template>
  <div>
    <Row>
      <Col span="11">
        <Card>
          <List>
            <ListItem>
              <ListItemMeta title="所属项目" :description="data.projectName" />
            </ListItem>
            <ListItem>
              <ListItemMeta title="需求名称" :description="data.name" />
            </ListItem>
            <ListItem>
              <ListItemMeta title="当前状态" :description="data.currentStateName" />
            </ListItem>
            <ListItem>
              <ListItemMeta title="详细描述" :description="data.desc" />
            </ListItem>
            <ListItem>
              <ListItemMeta title="创建时间" :description="data.createdDate" />
            </ListItem>

          </List>
        </Card>
      </Col>
      <Col span="4">
        <Card style="margin-left: 5px; font-weight: bold; font-size: 16px">
          异常检查
        </Card>
        <Card style="margin-left: 5px;">
          <div style="height: 300px;">
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
            <Progress :percent="45" status="active" :stroke-width="25"/>
            <div style="padding-bottom: 10px; padding-top: 10px;">完成进度</div>
            <Progress :percent="100" :stroke-width="25" style/>
          </div>
        </Card>
      </Col>
      <Col span="4">
        <Card style="margin-left: 5px; font-weight: bold; font-size: 16px">
          进度节点
        </Card>
        <Card style="margin-left: 5px">
          <Timeline>
            <TimelineItem color="green">
              <Icon type="md-create" slot="dot"></Icon>
              <p class="time">{{data.createdDate}}</p>
              <p class="content">创建需求</p>
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
import moment from 'moment'

export default {
  name: 'view',

  data () {
    return {
      colorGray: '#999999',
      currentDate: '',
      devStartTimeColor: 'red',
      testStartTimeColor: 'red',
      deployStartTimeColor: 'red',
      deadlineColor: 'red',
      data: {}
    }
  },

  created () {
    this.load({})
  },

  methods: {
    load (params) {
      let time = new Date().getTime()
      this.currentDate = moment(time).format('YYYY-MM-DD hh:mm:ss')
      params.id = this.$route.query.id
      api.getFunction(params).then((res) => {
        if (res.data.success) {
          this.data = res.data.data

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
