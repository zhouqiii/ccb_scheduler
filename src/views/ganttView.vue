<template>
  <m-list-construction title="甘特图">
    <template slot="content">
      <div class="gantt-model">
        <div class="gantt-state">
          <div class="state-tasks-color-sp">
            <a href="javascript:">
              <span>任务状态</span>
            </a>
            <a href="javascript:" v-for="(item) in tasksState" :key="item.id" class="flex-row">
              <div class="boxFlag" :style="{background:item.color}"></div>
              <span>{{item.desc}}</span>
            </a>
          </div>
        </div>
        <template v-if="!isNodata">
          <div class="gantt"></div>
        </template>
        <template v-else>
          <m-no-data></m-no-data>
        </template>
        <m-spin :is-spin="isLoading">
        </m-spin>
      </div>
    </template>
  </m-list-construction>
</template>
<script>
import { mapActions } from 'vuex';
import Gantt from '../utils/gantt';
import { tasksState } from '../components/Dag/config';
import mSpin from '../components/spin.vue';
import mNoData from '../components/noData/noData.vue';
import mListConstruction from '../components/listConstruction/listConstruction.vue';

export default {
  name: 'gantt',
  data() {
    return {
      // Node state
      tasksState,
      // loading
      isLoading: true,
      // gantt data
      ganttData: {
        taskNames: [],
      },
      // Data available
      isNodata: false,
    };
  },
  props: {},
  methods: {
    ...mapActions('dag', ['getViewGantt']),
    /**
     * get data
     */
    getGantt() {
      this.isLoading = true;
      this.getViewGantt({
        processInstanceId: this.$route.params.id || 22, // 唯一标识
      }).then((res) => {
        this.ganttData = res;
        if (!res.taskNames.length || !res) {
          this.isLoading = false;
          this.isNodata = true;
          return;
        }
        // Gantt
        Gantt.init({
          el: '.gantt',
          tasks: res.tasks,
        });
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      }).catch((e) => {
        console.log(e);
        this.isLoading = false;
      });
    },
  },
  watch: {},
  created() {

  },
  mounted() {
    this.getGantt();
  },
  updated() {
  },
  beforeDestroy() {
  },
  destroyed() {
  },
  computed: {},
  components: { mListConstruction, mSpin, mNoData },
};
</script>

<style lang="less" scoped>
/* 另一些样式定义在common.less里全局定义避免页面渲染不上 */
.state-tasks-color-sp {
  >a {
    text-decoration: none;
    margin-right: 10px;
    color: #2d8cf0;
    cursor:default;
    &:hover {
      span {
        color: #333;
      }
    }
    span {
      vertical-align: middle;
      font-size: 12px;
    }
  }
}
.gantt-model {
  background: url('../assets/images/dag_bg.png');
  height: calc(100vh - 148px);
  .gantt-state {
    background: #fff;
    height: 48px;
    line-height: 48px;
    padding-left: 20px;
    .state-tasks-color-sp{
      display: flex;
      .boxFlag{
        height: 12px;
        width: 12px;
        border-radius: 2px;
        margin-right: 2px;
      }
    }
  }
  .gantt {
    height: calc(100vh - 220px);
    overflow-y: scroll;
  }
}
</style>
