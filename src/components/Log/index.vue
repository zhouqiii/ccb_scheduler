<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :width="scriptWidth"
      top="50px"
      :show-close="false"
      :destroy-on-close="true"
    >
      <div slot="title" class="title">
        <div>查看日志</div>
        <div>
          <i class="el-icon-download"></i>
          <i class="el-icon-refresh" @click="refreshLog"></i>
          <i class="el-icon-full-screen" v-if="isScreen" @click="screenClose"></i>
          <i class="el-icon-rank" v-if="!isScreen" @click="screenOpen"></i>
        </div>
      </div>
      <div class="content">
        <div class="content-log-box">
          <textarea
            class="textarea-ft"
            id="textarea-log"
            style="width: 100%"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeLog" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery';
import _ from 'lodash';
/**
 * Calculate text size
 */
const handerTextareaSize = (isH = 0) => {
  $('body').find('.tooltip.fade.top.in').remove();
  return $('.textarea-ft').css({ height: `${$('.content-log-box').height() - isH}px` });
};
let content = '';
export default {
  name: 'log-view',
  props: {
    ifModal: Boolean,
    taskInstanceId: Number,
  },
  data() {
    return {
      scriptWidth: '750px',
      dialogVisible: false,
      isScreen: false,
      loadingIndex: 0,
      isData: false, // 用来标识是否还有log内容，如果log没有下一页的话为false，那么滚动到底部也不需要在发送请求了
    };
  },
  methods: {
    getLog() {
      this.$store.dispatch('dag/getLog', this.logParam).then((res) => {
        if (!res.data) {
          this.isData = false;
          setTimeout(() => {
            this.$message.warning('暂无更多日志内容');
          }, 1000);
          // Handling text field size
          handerTextareaSize().html('').text(content || '暂无日志');
        } else {
          this.isData = true;
          content = res.data;
          handerTextareaSize().html('').text(content || '暂无日志');
          setTimeout(() => {
            $('#textarea').scrollTop(2);
          }, 800);
        }
      }).catch((e) => {
        this.$message.error(e.msg || '');
      });
    },
    refreshLog() {
      this.$store.dispatch('dag/getLog', this.logParam).then((res) => {
        setTimeout(() => {
          if (res.data) {
            this.$message.success('已更新日志');
          } else {
            this.$message.warning('暂无更多日志');
          }
        }, 1500);
        // Handling text field size
        handerTextareaSize().html('').text(res.data || '暂无日志');
      }).catch((e) => {
        this.$message.error(e.msg || '');
      });
    },
    screenOpen() {
      this.isScreen = true;
      const $logBox = $('.el-dialog');
      const $logBoxBody = $('.el-dialog__body');
      const winW = $(window).width() - 40;
      $logBox.css({
        width: winW,
        top: '20px',
      });
      $logBoxBody.css({
        height: '400px',
      });
      $logBox.find('.content').animate({ scrollTop: 0 }, 0);
      // Handling text field size
      handerTextareaSize().html('').text(content);
    },
    screenClose() {
      this.isScreen = false;
      const $logBox = $('.el-dialog');
      const $logBoxBody = $('.el-dialog__body');
      $logBoxBody.attr('style', '');
      $logBox.css({
        width: '750px',
        top: '50px',
      });
      $logBox.find('.content').animate({ scrollTop: 0 }, 0);
      // Handling text field size
      handerTextareaSize().html('').text(content);
    },
    // up lodash.debounce(func, time, options)防抖，限制时间调用函数
    onUp: _.debounce(function () {
      this.loadingIndex -= 1;
      this.getLog();
    }, 1000, {
      leading: false, // 指定在延迟开始前调用
      trailing: true, // 指定在延迟结束后调用
    }),
    // down
    onDown: _.debounce(function () {
      this.loadingIndex += 1;
      this.getLog();
    }, 1000, {
      leading: false,
      trailing: true,
    }),
    /**
     * Monitor scroll bar
     */
    onTextareaScroll() {
      const self = this;
      $('#textarea-log').scroll(function () {
        const $this = $(this);
        // 滚动条滚动到顶部事件
        if (($this.scrollTop() + $this.height()) === $this.height()) {
          if (self.loadingIndex > 0) {
            self.$message.info('加载中');
            self.onUp();
          }
        }
        // 滚动条滚动到底部事件
        if ($this.get(0).scrollHeight === ($this.height() + Math.ceil($this.scrollTop()))) {
          // No data is not requested
          if (self.isData) {
            self.$message.info('加载中');
            self.onDown();
          }
        }
      }, true);
    },
    closeLog() {
      content = '';
      this.loadingIndex = 0;
      this.isScreen = false;
      this.dialogVisible = false;
      this.$emit('closeLog');
    },
  },
  mounted() {
    const that = this;
    // eslint-disable-next-line prefer-arrow-callback
    document.addEventListener('scroll', function (event) {
      const dom = event.target;
      if (dom.id === 'textarea-log') {
        if (dom.scrollTop === 0) {
          console.log('顶部');
          if (that.loadingIndex > 0) {
            that.$message.info('加载中');
            that.onUp();
          }
        }
        // 滚动条滚动到底部事件
        if (dom.scrollHeight === (Number(dom.style.height.split('px')[0]) + Math.floor(dom.scrollTop))) {
          console.log('底部');
          // No data is not requested
          if (that.isData) {
            that.$message.info('加载中');
            that.onDown();
          }
        }
      }
    }, true);
    // this.onTextareaScroll(); // 一般直接挂载这个方法就可以了，但这里实现不了，所以用document原生js统一监听
  },
  watch: {
    ifModal(val) {
      this.dialogVisible = val;
      this.getLog(val);
    },
  },
  computed: {
    logParam() {
      return {
        taskInstanceId: this.taskInstanceId,
        skipLineNum: parseInt(`${this.loadingIndex ? `${this.loadingIndex}000` : 0}`, 10),
        limit: parseInt(`${this.loadingIndex ? this.loadingIndex + 1 : 1}000`, 10),
      };
    },
  },
};
</script>
<style lang="less" scoped>
@import url('../../assets/css/pageStyle/log.less');
/deep/.el-dialog__body{
  position: relative;
  width: 100%;
  overflow: auto;
  height: 360px;
  padding: 0;
}
/deep/.el-dialog__header{
  padding: 0;
  .title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
  }
}
/deep/.el-dialog__footer{
  padding: 10px;
}

</style>
