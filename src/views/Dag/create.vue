<template>
  <div class="home-main index-model">
    <m-dag v-if="!isLoading"></m-dag>
    <m-spin :is-spin="isLoading"></m-spin>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import mDag from '../../components/Dag/dag.vue';
import mSpin from '../../components/spin.vue';
import disabledState from '../../components/Dag/module/mixin/disabledState';
import switchProject from '../../components/Dag/module/mixin/switchProject';

export default {
  name: 'create-dag',
  data() {
    return {
      isLoading: true,
    };
  },
  // mixins
  mixins: [disabledState, switchProject],
  props: {},
  methods: {
    ...mapMutations('dag', ['resetParams']),
    ...mapActions('dag', ['getTenantList', 'getWorkerGroupsAll', 'getProcessList', 'getProjectList', 'getResourcesList', 'getResourcesListJar']),
    /**
     * init
     */
    init() {
      this.isLoading = true;
      // 初始化dag状态参数
      this.resetParams();
      // Promise Get node needs data
      Promise.all([
        this.getProcessList(), // 工作流页面表格list
        this.getProjectList(), // 项目列表list
        this.getResourcesListJar(), // 获取jar
        this.getResourcesListJar('PYTHON'), // 获取jar
        this.getResourcesList(), // 获取结点弹框里资源选项的所有资源list
        this.getWorkerGroupsAll(), // 获取结点弹框里选项中的所有服务器组list
        this.getTenantList(), // 如果是有权限配置的话，这里需要获取登录的用户名单
      ]).then((data) => {
        console.log(data);
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      });
    },
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.init();
      },
    },
  },
  created() {
    this.init();
  },
  mounted() {
  },
  components: { mSpin, mDag },
};
</script>
