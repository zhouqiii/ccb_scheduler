<template>
  <div class="clearfix dag-model" >
    <div class="toolbar">
      <div class="title"><span>工具栏</span></div>
      <div class="toolbar-btn">
        <div
          class="bar-box roundedRect jtk-draggable jtk-droppable jtk-endpoint-anchor jtk-connected"
          :class="v === dagBarId ? 'active' : ''"
          :id="v"
          :key="v"
          v-for="(item,v) in tasksTypeList"
          @mousedown="getDagId(v)"
        >
          <el-tooltip effect="dark" :content="item.desc">
            <div class="icos" :class="'icos-' + v" ></div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="dag-contect">
      <div class="dag-toolbar">
        <div class="assist-btn">
          <el-tooltip effect="dark" content="查看变量">
            <el-button
              :type="$route.name !== 'dag/instance' ? 'default' : 'primary'"
              icon="el-icon-paperclip"
              style="vertical-align: middle;"
              size="mini"
              :disabled="$route.name !== 'dag/instance'"
              @click="doToggleView"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="启动参数">
            <el-button
              :type="$route.name !== 'dag/instance' ? 'default' : 'primary'"
              style="vertical-align: middle;"
              icon="el-icon-video-play"
              size="mini"
              :disabled="$route.name !== 'dag/instance'"
              @click="doToggleParam"
            ></el-button>
          </el-tooltip>
          <span class="name">{{name}}</span>
          &nbsp;
          <span
            v-if="name"
            class="copy-name"
            @click="doCopyName"
            :data-clipboard-text="name"
          >
            <el-tooltip effect="dark" content="复制名称">
              <i class="el-icon-copy-document"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="save-btn">
          <div class="operation" style="vertical-align: middle;">
            <a href="javascript:"
              v-for="(item,$index) in toolOperList"
              :class="doOperationClass(item)"
              :id="item.code"
              :key="$index"
              @click="doCkOperation(item,$event)"
            >
              <el-tooltip effect="light" :content="item.desc">
                <i :class="item.icon"></i>
              </el-tooltip>
            </a>
          </div>
          <el-tooltip effect="light" content="格式化DAG">
            <el-button
              type="primary"
              icon="el-icon-caret-right"
              style="vertical-align: middle;"
              size="mini"
              v-if="type === 'instance' || 'definition'"
              @click="dagAutomaticLayout"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="刷新DAG">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              style="vertical-align: middle;"
              size="mini"
              :loading="isRefresh"
              v-if="type === 'instance'"
              @click="!isRefresh && doRefresh()"
            ></el-button>
          </el-tooltip>
          <el-button
            type="primary"
            icon="el-icon-receiving"
            style="vertical-align: middle;"
            size="mini"
            :loading="spinnerLoading"
            @click="doSaveChart"
          >{{spinnerLoading ? 'Loading...' : '保存'}}</el-button>
        </div>
      </div>
      <div class="scrollbar dag-container">
        <div class="jtk-demo" id="jtk-demo">
          <div
            class="jtk-demo-canvas
              canvas-wide statemachine-demo jtk-surface jtk-surface-nopan jtk-draggable"
            id="canvas"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import _ from 'lodash';
import { jsPlumb } from 'jsplumb';
import Clipboard from 'clipboard';
import { mapActions, mapState, mapMutations } from 'vuex';
import { allNodesId } from './plugIn/util';
import { toolOper, tasksType } from './config';
import { formatDate } from '../../utils/filter/filter';
import { findComponentDownward } from '../../utils/tree/index';
import disabledState from './module/mixin/disabledState';
import Dag from './dag';

let eventModel;

export default {
  name: 'dag-chart',
  data() {
    return {
      tasksTypeList: tasksType,
      toolOperList: toolOper(this),
      dagBarId: null,
      toolOperCode: '',
      spinnerLoading: false,
      urlParam: {
        id: this.$route.params.id || null,
      },
      isRefresh: false,
      isLoading: false,
      taskId: null,
      arg: false,

    };
  },
  mixins: [disabledState],
  props: {
    type: String,
    releaseState: String,
  },
  methods: {
    ...mapActions('dag', ['saveDAGchart', 'updateInstance', 'updateDefinition', 'getTaskState']),
    ...mapMutations('dag', ['addTasks', 'cacheTasks', 'resetParams', 'setIsEditDag', 'setName']),
    // DAG automatic layout
    dagAutomaticLayout() {
      if (this.store.state.dag.isEditDag) {
        this.$message.warning('Please save the DAG before formatting');
      } else {
        $('#canvas').html('');
        // Destroy round robin
        Dag.init({
          dag: this,
          instance: jsPlumb.getInstance({
            Endpoint: [
              'Dot', { radius: 1, cssClass: 'dot-style' },
            ],
            Connector: 'Bezier',
            PaintStyle: { lineWidth: 2, stroke: '#456' }, // Connection style
            ConnectionOverlays: [
              [
                'Arrow',
                {
                  location: 1,
                  id: 'arrow',
                  length: 12,
                  foldback: 0.8,
                },
              ],
            ],
            Container: 'canvas',
          }),
        });
        if (this.tasks.length) {
          Dag.backfill(true);
          if (this.type === 'instance') {
            this.doGetTaskState(false).then(() => {});
          }
        } else {
          Dag.create();
        }
      }
    },
    init(args) {
      if (this.tasks.length) {
        Dag.backfill(args);
        // Process instances can view status
        if (this.type === 'instance') {
          this.doGetTaskState(false).then(() => {});
          // Round robin acquisition status
          this.setIntervalP = setInterval(() => {
            this.doGetTaskState(true).then(() => {});
          }, 90000);
        }
      } else {
        Dag.create();// 新增工作流
      }
    },
    /**
       * copy name
       */
    doCopyName() {
      const clipboard = new Clipboard('.copy-name');
      clipboard.on('success', () => {
        this.$message.success('Copy success');
        // Free memory
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        // Copy is not supported
        this.$message.warning('The browser does not support automatic copying');
        // Free memory
        clipboard.destroy();
      });
    },
    /**
     * Get state interface
     * @param isReset Whether to manually refresh
     */
    doGetTaskState(isReset) {
      return new Promise((resolve) => {
        this.getTaskState(this.urlParam.id).then((res) => {
          const data = res.list;
          const state = res.processInstanceState;
          const { taskList } = res;
          const idArr = allNodesId();
          const titleTpl = (item, desc) => {
            const $item = _.filter(taskList, (v) => v.name === item.name)[0];
            return `<div style="text-align: left">Name：${$item.name}</br>State：${desc}</br>type：${$item.taskType}</br>host：${$item.host || '-'}</br>Retry Count：${$item.retryTimes}</br>Submit Time：${formatDate($item.submitTime)}</br>Start Time：${formatDate($item.startTime)}</br>End Time：${$item.endTime ? formatDate($item.endTime) : '-'}</br></div>`;
          };
          // remove tip state dom
          $('.w').find('.state-p').html('');
          data.forEach((v1) => {
            idArr.forEach((v2) => {
              if (v2.name === v1.name) {
                const dom = $(`#${v2.id}`);
                // eslint-disable-next-line no-shadow
                const state = dom.find('.state-p');
                let depState = '';
                taskList.forEach((item) => {
                  if (item.name === v1.name) {
                    depState = item.state;
                  }
                });
                dom.attr('data-state-id', v1.stateId);
                dom.attr('data-dependent-result', v1.dependentResult || '');
                dom.attr('data-dependent-depState', depState);
                state.append(`<strong class="${v1.icoUnicode} ${v1.isSpin ? 'as as-spin' : ''}" style="color:${v1.color}" data-toggle="tooltip" data-html="true" data-container="body"></strong>`);
                state.find('strong').attr('title', titleTpl(v2, v1.desc));
              }
            });
          });
          if (state === 'PAUSE' || state === 'STOP' || state === 'FAILURE' || this.state === 'SUCCESS') {
            // Manual refresh does not regain large json
            if (isReset) {
              // eslint-disable-next-line no-underscore-dangle
              findComponentDownward(this.$root, `${this.type}-details`)._reset();
            }
          }
          resolve();
        });
      });
    },
    /**
     * Get the action bar id
     * @param item
     */
    getDagId(v) {
      this.dagBarId = v;
    },
    /**
       * operating
       */
    doCkOperation(item) {
      let is = true;
      let code = '';
      if (item.disable) {
        return;
      }
      if (this.toolOperCode === item.code) {
        this.toolOperCode = '';
        // eslint-disable-next-line prefer-destructuring
        code = item.code;
        is = false;
      } else {
        this.toolOperCode = item.code;
        code = this.toolOperCode;
        is = true;
      }
      // event type
      Dag.toolbarEvent({
        item,
        code,
        is,
      });
    },
    doOperationClass(item) {
      return this.toolOperCode === item.code ? 'active' : '';
    },
    /**
     * Storage interface
     */
    doSave(sourceType) {
      return new Promise((resolve, reject) => {
        this.spinnerLoading = true;
        // Storage store
        Dag.saveStore().then((res) => {
          if (this.doVerifConditions(res.tasks)) {
            if (this.urlParam.id) {
              /**
               * Edit
               * @param saveInstanceEditDAGChart => Process instance editing
               * @param saveEditDAGChart => Process definition editing
               */
              // eslint-disable-next-line no-shadow
              this[this.type === 'instance' ? 'updateInstance' : 'updateDefinition'](this.urlParam.id).then((res) => {
                this.$message.success(res.msg);
                this.spinnerLoading = false;
                resolve();
              }).catch((e) => {
                this.$message.error(e.msg || '');
                this.spinnerLoading = false;
                reject(e);
              });
            } else {
              // New
              // eslint-disable-next-line no-shadow
              this.saveDAGchart().then((res) => {
                this.$message.success(res.msg);
                this.spinnerLoading = false;
                // source @/conf/home/pages/dag/_source/editAffirmModel/index.js
                if (sourceType !== 'affirm') {
                  // Jump process definition
                  this.$router.push({ name: 'projects-definition-list', params: { projectId: this.projectId } });
                }
                resolve();
              }).catch((e) => {
                this.$message.error(e.msg || '');
                this.setName('');
                this.spinnerLoading = false;
                reject(e);
              });
            }
          }
        });
      });
    },
    doVerifConditions(value) {
      const tasks = value;
      let bool = true;
      tasks.map((v) => {
        if (v.type === 'CONDITIONS' && (v.conditionResult.successNode[0] === '' || v.conditionResult.successNode[0] == null || v.conditionResult.failedNode[0] === '' || v.conditionResult.failedNode[0] == null)) {
          bool = false;
          return false;
        }
        return true;
      });
      if (!bool) {
        this.$message.warning('Successful branch flow and failed branch flow are required');
        this.spinnerLoading = false;
        return false;
      }
      return true;
    },
    /**
     * Global parameter
     * @param Promise
     */
    doUdpTopFloorPop() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        // const modal = this.$modal.dialog({
        //   closable: false,
        //   showMask: true,
        //   escClose: true,
        //   className: 'v-modal-custom',
        //   transitionName: 'opacityp',
        //   render() {
        //     // return h(mUdp, {
        //     //   on: {
        //     //     onUdp() {
        //     //       modal.remove();
        //     //       resolve();
        //     //     },
        //     //     close() {
        //     //       modal.remove();
        //     //     },
        //     //   },
        //     // });
        //   },
        // });
      });
    },
    /**
       * Save chart
       */
    doSaveChart() {
      // Verify node
      if (!this.tasks.length) {
        this.$message.warning('Failed to create node to save');
        return;
      }
      // Global parameters (optional)
      this.doUdpTopFloorPop().then(() => this.doSave());
    },
    /**
       * Subprocess processing
       * @param subProcessId Subprocess ID
       */
    doSubProcessHandle(subProcessId) {
      let subProcessIds = [];
      const getIds = this.$route.query.subProcessIds;
      if (getIds) {
        const newId = getIds.split(',');
        newId.push(this.urlParam.id);
        subProcessIds = newId;
      } else {
        subProcessIds.push(this.urlParam.id);
      }
      const $name = this.$route.name.split('-');
      this.$router.push({ path: `/${$name[0]}/${$name[1]}/list/${subProcessId}`, query: { subProcessIds: subProcessIds.join(',') } });
    },
    /**
       * Refresh data
       */
    doRefresh() {
      this.isRefresh = true;
      this.doGetTaskState(false).then(() => {
        setTimeout(() => {
          this.isRefresh = false;
          this.$message.success('Refresh status succeeded');
        }, 2200);
      });
    },
    /**
       * View variables
       */
    doToggleView() {
      findComponentDownward(this.$root, 'assist-dag-index').doToggleView();
    },
    /**
       * Starting parameters
       */
    doToggleParam() {
      findComponentDownward(this.$root, 'starting-params-dag-index').doToggleParam();
    },
    /**
       * Create a node popup layer
       * @param Object id
       */
    createNodes({ id, type }) {
      console.log(type);
      const self = this;
      self.$modal.destroy();
      let preNode = [];
      const rearNode = [];
      let rearList = [];
      $(`div[data-targetarr*="${id}"]`).each(function () {
        rearNode.push($(this).attr('id'));
      });
      if (rearNode.length > 0) {
        rearNode.forEach((v) => {
          const rearobj = {};
          rearobj.value = $(`#${v}`).find('.name-p').text();
          rearobj.label = $(`#${v}`).find('.name-p').text();
          rearList.push(rearobj);
        });
      } else {
        rearList = [];
      }
      const target = $(`#${id}`).attr('data-targetarr');
      if (target) {
        const nodearr = target.split(',');
        nodearr.forEach((v) => {
          const nodeobj = {};
          nodeobj.value = $(`#${v}`).find('.name-p').text();
          nodeobj.label = $(`#${v}`).find('.name-p').text();
          preNode.push(nodeobj);
        });
      } else {
        preNode = [];
      }
      if (eventModel) {
        eventModel.remove();
      }
      // const removeNodesEvent = (fromThis) => {
      //   // Manually destroy events inside the component
      //   fromThis.$destroy();
      //   // Close the popup
      //   eventModel.remove();
      // };
      this.taskId = id;
      // eslint-disable-next-line no-param-reassign
      type = type || self.dagBarId;
      eventModel = this.$drawer({
        closable: false,
        direction: 'right',
        escClose: true,
        className: 'dagMask',
        // render: (h) => h(mFormModel, {
        //   on: {
        //     addTaskInfo({ item, fromThis }) {
        //       self.addTasks(item);
        //       setTimeout(() => {
        //         removeNodesEvent(fromThis);
        //       }, 100);
        //     },
        //     /**
        //        * Cache the item
        //        * @param item
        //        * @param fromThis
        //        */
        //     cacheTaskInfo({ item, fromThis }) {
        //       self.cacheTasks(item);
        //     },
        //     close({ item, flag, fromThis }) {
        //       self.addTasks(item);
        //       // Edit status does not allow deletion of nodes
        //       if (flag) {
        //         jsPlumb.remove(id);
        //       }

        //       removeNodesEvent(fromThis);
        //     },
        //     onSubProcess({ subProcessId, fromThis }) {
        //       removeNodesEvent(fromThis);
        //       self.doSubProcessHandle(subProcessId);
        //     },
        //   },
        //   props: {
        //     id,
        //     taskType: type,
        //     self,
        //     preNode,
        //     rearList,
        //     instanceId: this.$route.params.id,
        //   },
        // }),
      });
    },
    removeEventModelById($id) {
      if (eventModel && this.taskId === $id) {
        eventModel.remove();
      }
    },
  },
  watch: {
    tasks: {
      handler(o) {
        // tasks是dag上的结点信息，如果tasks有变化，那么说明dag上结点信息有变化
        // state.isEditDag为false说明变化后的dag未保存，这个时候格式化DAG会提示先保存
        this.setIsEditDag(true);
        console.log(o);
      },
    },
  },
  created() {
    this.setIsEditDag(false);
    Dag.init({
      dag: this,
      instance: jsPlumb.getInstance({
        Endpoint: [
          'Dot', { radius: 1, cssClass: 'dot-style' }, // 端点的样式声明
        ],
        Connector: 'Bezier', // 连线类型
        PaintStyle: { lineWidth: 2, stroke: '#456' }, // 连线样式
        ConnectionOverlays: [// 连线的叠加组件，如箭头，标签等
          [
            'Arrow', // 箭头参数设置
            {
              location: 1,
              id: 'arrow',
              length: 12,
              foldback: 0.8,
            },
          ],
        ],
        Container: 'canvas', // 父级元素id: dag图最外层一定要设置id
      }),
    });
  },
  mounted() {
    this.init(this.arg);
  },
  beforeDestroy() {
    this.resetParams();
    // Destroy round robin
    clearInterval(this.setIntervalP);
  },
  destroyed() {
    if (eventModel) {
      eventModel.remove();
    }
  },
  computed: {
    ...mapState('dag', ['projectId', 'tasks', 'locations', 'connects', 'isEditDag', 'name']),
  },
  components: {},
};
</script>

<style lang="less" scoped>
  @import "../../assets/css/pageStyle/dag.less";
</style>
