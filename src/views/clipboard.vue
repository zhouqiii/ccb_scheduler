<template>
  <div style="font-size: 16px">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      class="dag-layout-form"
    >
      <el-form-item label="文本">
        <el-input v-model="message" class="name">
          <div slot="append">
            <el-button
              type="primary"
              v-if="message"
              id="copy-name"
              :data-clipboard-text="message"
              @click="copyName"
            >复制</el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="复制文本">
        <el-input v-model="copyMessage" class="name" placeholder="你可以ctrl+v把内容复制到这里"></el-input>
      </el-form-item>
      <el-form-item label="脚本" class="form-mirror">
        <div :style="scriptStyle">
          <textarea
            :disabled="isDetails"
            id="code-shell-mirror"
            name="code-shell-mirror"
            style="opacity: 0"
          ></textarea>
         <i class="el-icon-rank" @click="setFullScreen"></i>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      :width="scriptWidth"
      top="50px"
      :show-close="false"
      :destroy-on-close="true"
    >
      <div slot="title">
        <i class="el-icon-full-screen" @click="closeFull"></i>
      </div>
      <script-box :item="childRawScript" @getSriptBoxValue="getSriptBoxValue"></script-box>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery';
import Clipboard from 'clipboard';
import codemirror from '../utils/codemirror';
// eslint-disable-next-line import/no-cycle
import disabledState from '../components/Dag/module/mixin/disabledState';
import ScriptBox from '../components/scriptBox.vue';

let editor;
export default {
  name: 'clipboard',
  components: { ScriptBox },
  data() {
    return {
      scriptStyle: 'width: calc(100% - 100px);display: flex',
      scriptWidth: `${($(window).width() - 40)}px`,
      form: {},
      message: 'message',
      copyMessage: '',
      dialogVisible: false,
      rawScript: '',
      childRawScript: '',
    };
  },
  mixins: [disabledState],
  methods: {
    copyName() {
      const copyText = document.getElementById('copy-name');
      const clipboard = new Clipboard(copyText);
      clipboard.on('success', (e) => {
        alert('复制成功');
        console.log(e);
        // Free memory
        clipboard.destroy();
      });
      clipboard.on('error', (e) => {
        // Copy is not supported
        alert('浏览器不支持自动复制');
        console.log(e);
        // Free memory
        clipboard.destroy();
      });
    },
    handlerEditor() {
      // editor
      editor = codemirror('code-shell-mirror', {
        mode: 'shell',
        readOnly: this.isDetails,
      });
      this.keypress = () => {
        if (!editor.getOption('readOnly')) {
          editor.showHint({
            completeSingle: false,
            extraKeys: {
              Enter: '',
            },
          });
        }
      };
      // Monitor keyboard
      editor.on('keypress', this.keypress);
      editor.setValue(this.rawScript);
      return editor;
    },
    closeFull() {
      editor.setValue(this.rawScript);
      this.dialogVisible = false;
    },
    setFullScreen() {
      this.childRawScript = editor.getValue();
      this.dialogVisible = true;
    },
    getSriptBoxValue(val) {
      this.rawScript = val;
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.handlerEditor();
    }, 200);
  },
  destroyed() {
    // 销毁editor实例
    if (editor) {
      editor.toTextArea(); // Uninstall
      editor.off($('.code-shell-mirror'), 'keypress', this.keypress);
    }
  },
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body{
  padding: 0px;
}
/deep/.el-dialog__header{
  display: flex;
  flex-direction: row-reverse;
  padding: 10px;
}
.form-mirror {
  width: 100%;
  position: relative;
  z-index: 0;
  /deep/.CodeMirror {
    width: 100%;
    height:auto;
    min-height: 72px;
    border: 1px solid #ddd !important;
    border-radius: 3px;
  }
  /deep/.CodeMirror-scroll {
    height:calc(50vh - 50px);
    min-height: 72px;
    overflow-y: hidden;
    overflow-x: auto;
    .CodeMirror-sizer{
      margin-left: 33px !important;
      margin-bottom: -17px;
      border-right-width: 33px !important;
      min-height: 28px !important;
      min-width: 35px !important;
      padding-right: 0px !important;
      padding-bottom: 0px !important;
      .CodeMirror-code{
        .CodeMirror-line{
          line-height: 20px;
        }
        .CodeMirror-linenumber{
          height: 20px;
          line-height: 20px;
        }
      }
    }
    .CodeMirror-gutters{
      background: #f8f8f8;
      color: #333;
      border-left: 0 !important;
      .CodeMirror-linenumbers{
        width: 32px !important;
      }
    }
  }
}
</style>
