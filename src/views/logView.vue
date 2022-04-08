<template>
  <div style="font-size: 16px">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      class="dag-layout-form"
    >
      <el-form-item label="查看日志">
        <el-button type="primary" @click="openLog">查看</el-button>
      </el-form-item>
    </el-form>
    <log-view
      :ifModal="ifModal"
      :taskInstanceId="taskInstanceId"
      @closeLog="ifModal = false"
    ></log-view>
  </div>
</template>
<script>
import LogView from '../components/Log/index.vue';

export default {
  name: 'log',
  components: { LogView },
  data() {
    return {
      form: {},
      taskInstanceId: null,
      ifModal: false,
    };
  },
  methods: {
    openLog() {
      this.taskInstanceId = 22;// 一般传入一个查看当前任务的唯一标识
      this.ifModal = true;
    },
  },
  created() {},
  mounted() {
  },
  destroyed() {
  },
};
</script>
