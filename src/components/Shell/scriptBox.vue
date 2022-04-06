<template>
  <div class="script-model">
    <m-list-box>
      <div slot="content">
        <div class="form-mirror1">
          <textarea
            id="code-shell-mirror1"
            name="code-shell-mirror1"
            style="opacity: 0">
          </textarea>
        </div>
      </div>
    </m-list-box>
  </div>
</template>
<script>
import $ from 'jquery';
import _ from 'lodash';
import mListBox from './listBox.vue';
import disabledState from '../Dag/module/mixin/disabledState';
import codemirror from '../../utils/codemirror';

let editor;

export default {
  name: 'shell',
  data() {
    return {
      // script
      rawScript: '',
    };
  },
  mixins: [disabledState],
  props: {
    item: String,
  },
  methods: {
    /**
     * Processing code highlighting
     */
    handlerEditor() {
      // editor
      const self = this;
      editor = codemirror('code-shell-mirror1', {
        mode: 'shell',
        readOnly: this.isDetails,
      });
      // eslint-disable-next-line prefer-arrow-callback
      editor.on('change', function () {
        self.$emit('getSriptBoxValue', editor.getValue());
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
  },
  watch: {},
  created() {
    const o = this.item;
    // Non-null objects represent backfill
    if (!_.isEmpty(o)) {
      this.rawScript = o;
    }
  },
  mounted() {
    setTimeout(() => {
      this.handlerEditor();
    }, 200);
  },
  destroyed() {
    if (editor) {
      editor.toTextArea();// Uninstall
      editor.off($('.code-shell-mirror1'), 'keypress', this.keypress);
    }
  },
  components: { mListBox },
};
</script>
<style lang="less" scoped>
.script-model {
  width:100%;
}
.form-mirror1 {
  /deep/.CodeMirror {
    height: calc(70vh - 90px);
    width: 100%;
    min-height: 72px;
    border: 1px solid #ddd !important;
    border-radius: 3px;
  }
  /deep/.CodeMirror-scroll {
    height: calc(70vh - 90px);
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
