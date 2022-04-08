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
      editor.on('change', () => {
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
  watch: {
    item: {
      handler(val) {
        this.rawScript = val;
        if (editor) {
          editor.setValue(val);
        }
      },
    },
  },
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
      editor.toTextArea(); // Uninstall
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
    .CodeMirror {
      height: calc(70vh - 90px);
    }
  }
</style>
