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
          </List>
        </Card>
      </Col>
      <Col span="4">
        <Card>
          111

        </Card>
      </Col>
      <Col span="4">
        <Card style="text-align: center; margin-left: 5px; font-weight: bold; font-size: 16px">
          进度占比
        </Card>
        <Card style="margin-left: 5px;">
          <div style="height: 300px;">
            <div style="padding-bottom: 10px; text-align: center">时间消耗</div>
            <Progress :percent="45" status="active" :stroke-width="25"/>
            <div style="padding-bottom: 10px; padding-top: 10px; text-align: center">完成进度</div>
            <Progress :percent="100" :stroke-width="25" style/>
          </div>
        </Card>
      </Col>
      <Col span="4">
        <Card style="margin-left: 5px; font-weight: bold; font-size: 16px">
          时间节点
        </Card>
        <Card style="margin-left: 5px">
          <Timeline>
            <TimelineItem>
              <p class="time">{{data.devStartTime}}</p>
              <p class="content">开始开发</p>
            </TimelineItem>
            <TimelineItem>
              <p class="time">{{data.devDeadline}}</p>
              <p class="content">开发完成</p>
            </TimelineItem>
            <TimelineItem>
              <p class="time">{{data.testDeadline}}</p>
              <p class="content">测试完成</p>
            </TimelineItem>
            <TimelineItem>
              <p class="time">{{data.deadline}}</p>
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
      currentDate: '',
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
    margin-bottom: 30px;
  }

</style>
