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
      <el-form-item label="脚本">
        <div :style="scriptStyle">
          <textarea
            :disabled="isDetails"
            id="code-shell-mirror"
            name="code-shell-mirror"
            style="opacity: 0"
          ></textarea>
          <el-icon size="16" color="#409EFC">
            <edit />
          </el-icon>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Clipboard from 'clipboard';

export default {
  name: 'clipboard',
  data() {
    return {
      scriptStyle: 'width: 500px;display: flex',
      form: {},
      message: 'message',
      copyMessage: '',
      isDetails: false,
    };
  },
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
  },
  created() {},
};
</script>
