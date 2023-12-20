<template>
  <section class="editor-container">
    <header class="header">
      <div class="left">
        <a-input
          v-model:model-value="title"
          class="input"
          placeholder="输入文章标题..."
          :max-length="100"
        />
      </div>
      <a-space class="right" size="medium">
        <a-button type="outline" @click="handleSave">保存为草稿</a-button>
        <a-button type="primary" @click="handlePublish">发布</a-button>
        <avatar-user></avatar-user>
      </a-space>
    </header>
    <editor
      class="editor"
      :locale="editorConfig.zh"
      :value="article"
      :plugins="editorConfig.plugins"
      placeholder="正文..."
      :upload-images="handleUpload"
      @change="handleContentChange"
    ></editor>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import {
  createArticle,
  createDraft,
  getArticle,
  updateArticle,
} from '@/api/article';
import { Message } from '@arco-design/web-vue';
import AvatarUser from './components/avatar.vue';
import editorConfig from '@/config/editor';
import { Editor } from '@bytemd/vue-next';
import { uploadFiles } from '@/api/common';

const route = useRoute();
const userStore = useUserStore();
const title = ref('');
const article = ref('');
const editPage = ref(false);
const articleId = route.params.id;

const fetchDraftContent = async () => {
  if (route.name !== 'editor-edit') return;
  editPage.value = true;
  const data = await getArticle(articleId);
  title.value = data.title;
  article.value = data.content;
};
fetchDraftContent();

const checkRequestParams = () => {
  const titleContent = title.value;
  const content = article.value;
  const userInfo = userStore.userInfo;
  if (!userInfo || !userInfo.uid) {
    Message.error('请登录后再进行文章处理');
    return;
  }
  if (!titleContent || !content || String(content).trim().length < 30) {
    Message.info('文章标题必须存在并且正文字数不得少于20字');
    return;
  }
  let description = String(content).slice(0, 80);
  description = description
    .split('\n')
    .filter(item => item.indexOf('#') === -1)
    .join(' ')
    .trim();
  return { title: titleContent, description, content, uid: userInfo.uid };
};
const handleContentChange = value => {
  article.value = value;
};
const handleSave = async () => {
  const params = checkRequestParams();
  if (!params) return;
  const api = editPage.value
    ? () => updateArticle(articleId, params)
    : () => createDraft(params);
  await api();
  Message.success('草稿保存成功');
};
const handlePublish = async () => {
  const params = checkRequestParams();
  if (!params) return;
  const api = editPage.value
    ? () => updateArticle(articleId, params)
    : () => createArticle(params);
  await api();
  Message.success('文章发布成功');
};
const handleUpload = async files => {
  if (!Array.isArray(files) || files.length === 0) return;
  const formData = new FormData();
  files.forEach(file => formData.append('file', file));
  const result = await uploadFiles(formData);
  return Array.isArray(result) ? result : [result];
};
</script>

<style lang="less" scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 700px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;

    .left {
      flex: 1;
      max-width: 500px;
    }

    .right {
      flex: none;
    }
  }

  .editor {
    flex: 1;
    height: 100%;

    :deep(.bytemd) {
      width: 100%;
      height: 100%;
    }
  }

  :deep(.input) {
    border: none;

    .arco-input {
      font-size: 24px;
    }
  }
}
</style>
