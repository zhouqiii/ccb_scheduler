<template>
  <m-list-construction title="树形图">
    <template slot="conditions"></template>
    <template slot="content">
      <div class="tree-view-index-model">
        <div class="tree-limit-select">
          <el-select v-model="limit" style="width: 70px;" @change="onDoChangeSelect" size="small">
            <el-option
              v-for="city in [{value:25},{value:50},{value:75},{value:100}]"
              :key="city.value"
              :value="city.value"
              :label="city.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="tasks-color">
          <div class="toolbar-color-sp">
            <a href="javascript:">
              <span>Node Type</span>
            </a>
            <a href="javascript:" v-for="(k,v) in tasksType" :key="v" class="flex-row">
              <div class="circleFlag" :style="{background:k.color}"></div>
              <span>{{v}}</span>
            </a>
          </div>
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
        <div class="tree-model" v-show="!isNodata">
          <div class="d3-tree">
            <svg class='tree' width="100%"></svg>
          </div>
        </div>
        <m-no-data v-if="isNodata"></m-no-data>
      </div>
      <m-spin :is-spin="isLoading"></m-spin>
    </template>
  </m-list-construction>

</template>
<script>
import _ from 'lodash';
import { mapActions, mapState } from 'vuex';
import Tree from '../utils/tree/tree';
import { uuid } from '../utils/tree/index';
import mSpin from '../components/spin.vue';
import mNoData from '../components/noData/noData.vue';
import mListConstruction from '../components/listConstruction/listConstruction.vue';
import { tasksState, tasksType } from '../components/Dag/config';

export default {
  name: 'tree',
  data() {
    return {
      // limit
      limit: 25,
      // loading
      isLoading: true,
      // node type
      tasksType,
      // node state
      tasksState,
      // tree data
      treeData: {},
      // is data
      isNodata: false,
    };
  },
  props: {},
  methods: {
    ...mapActions('dag', ['getViewTree']),
    setClose() {
      this.$router.go(-1);
    },
    /**
     * get tree data
     */
    getViewTreeList() {
      this.isLoading = true;
      Tree.reset();
      this.getViewTree({
        code: this.$route.params.code || 33, // 只是标记一个接口调用是的唯一标识
        limit: this.limit,
      }).then((res) => {
        const data = _.cloneDeep(res);
        this.treeData = data;
        if (!this.treeData.children) {
          this.isLoading = false;
          this.isNodata = true;
          return;
        }
        const recursiveChildren = (children) => {
          if (children.length) {
            _.map(children, (v) => {
              // eslint-disable-next-line no-param-reassign
              v.uuid = `${uuid('uuid_')}${uuid() + uuid()}`;
              if (v.children.length) {
                recursiveChildren(v.children);
              }
            });
          }
        };
        recursiveChildren(data.children);
        // init tree
        Tree.init({
          data: _.cloneDeep(data),
          limit: this.limit,
          selfTree: this,
        }).then(() => {
          setTimeout(() => {
            // this.isLoading = false
          }, 100);
        });
      }).catch((e) => {
        this.isLoading = false;
        if (!e.data) {
          this.isNodata = true;
        }
      });
    },
    /**
     * Subprocess processing
     * @param subProcessCode 子流程Code
     */
    onSubProcessHandle(subProcessCode) {
      console.log(subProcessCode);
      let subProcessCodes = [];
      const codes = this.$route.query.subProcessCodes;
      if (codes) {
        const newCode = codes.split(',');
        newCode.push(this.$route.params.code);
        subProcessCodes = newCode;
      } else {
        subProcessCodes.push(this.$route.params.code);
      }
      // this.$router.push({
      //  path: `/projects/${this.projectCode}/definition/tree/${subProcessCode}`,
      //  query: { subProcessCodes: subProcessCodes.join(',') }
      // });
    },
    onDoChangeSelect(o) {
      this.limit = o;
      this.getViewTreeList();
    },
  },
  // watch: {
  //   '$route.params.code': function () {
  //     this.getViewTreeList();
  //   },
  // },
  created() {
    this.getViewTreeList();
  },
  mounted() {
  },
  computed: {
    ...mapState('dag', ['projectCode']),
  },
  components: { mSpin, mListConstruction, mNoData },
};
</script>

<style lang="less" scoped>
/* 另一些样式定义在common.less里全局定义避免页面渲染不上 */
.toolbar-color-sp,.state-tasks-color-sp {
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
.tree-view-index-model {
  background: url('../assets/images/dag_bg.png');
  position: relative;
  .tree-limit-select {
    position: absolute;
    right: 20px;
    top: 22px;
    z-index: 1;
  }
  .tasks-color {
    min-height: 76px;
    background: #fff;
    padding-left: 20px;
    position: relative;
    padding-bottom: 10px;
    .toolbar-color-sp {
      padding: 12px 0;
      display: flex;
      .circleFlag{
        height: 12px;
        width: 12px;
        border-radius: 6px;
        margin-right: 2px;
      }
    }
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
  .tree-model {
    width: calc(100%);
    height: calc(100vh - 224px);
    overflow-x: scroll;
  }

}
</style>
