<template>
  <div class="drafts-container">
    <h3>文章草稿({{ total }})</h3>
    <a-empty v-show="!showList"></a-empty>
    <ul v-show="showList" class="ul">
      <li v-for="item of draftList" :key="item._id" class="list-item">
        <h4>
          <router-link
            class="link"
            :to="{ name: 'editor-edit', params: { id: item._id } }"
          >
            {{ item.title }}
          </router-link>
        </h4>
        <div class="flex">
          <span>{{ item.createTime }}</span>
          <span>
            <router-link :to="{ name: 'editor-edit', params: { id: item._id } }"
              ><icon-edit class="icon"
            /></router-link>
            <icon-delete class="icon" @click="() => handleDelete(item._id)" />
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import * as dayjs from 'dayjs';
import { Modal, Message } from '@arco-design/web-vue';
import { IconEdit, IconDelete } from '@arco-design/icon-vue';
import { getDrafts, deleteArticle } from '@/api/article';
import { useUserStore } from '@/store';
import useScrollPageRequest from '@/hook/useScrollPageRequest';

const userStore = useUserStore();
const total = ref(0);
const draftList = ref([]);
const showList = computed(() => {
  if (Array.isArray(draftList.value)) {
    return draftList.value.length > 0;
  }
  return false;
});

const fetchDrafts = async pageParams => {
  const uid = userStore.userInfo ? userStore.userInfo.uid : null;
  if (!uid) return;
  const result = await getDrafts({ uid, ...pageParams });
  const list = result.list || [];
  total.value = result.total;
  draftList.value = list.map(item => {
    return {
      id: item._id,
      title: item.title,
      createTime: dayjs(item.create_at).format('YYYY-MM-DD hh:mm:ss'),
    };
  });
  return list.length === pageParams.size;
};

useScrollPageRequest({
  element: document,
  request: pageParams => fetchDrafts(pageParams),
});

const handleDelete = articleId => {
  Modal.confirm({
    title: '删除草稿',
    content: '删除后不可恢复，确认删除此草稿吗？',
    'body-style': 'text-align:center;',
    onOk: async () => {
      await deleteArticle(articleId);
      Message.success('草稿删除成功');
      total.value = Math.max(0, total.value - 1);
      draftList.value = draftList.value.filter(item => item._id !== articleId);
    },
  });
};
</script>

<style lang="less" scoped>
.drafts-container {
  max-width: 600px;
  list-style: none;
  padding: 10px 20px;
  margin: 0 auto;
  border-radius: 3px;
  background: #fff;

  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }

  .ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list-item {
    padding: 20px 0;
    border-top: 1px solid rgba(0, 0, 0, 5%);
  }

  .link {
    &:hover {
      color: #1e80ff;
    }
  }

  .flex {
    display: flex;
    justify-content: space-between;
    line-height: 22px;
    color: #8a919f;

    .icon {
      font-size: 18px;
      padding: 0 5px;
      cursor: pointer;

      &:hover {
        color: #1e80ff;
      }
    }
  }
}
</style>
