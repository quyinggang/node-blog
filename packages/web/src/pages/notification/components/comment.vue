<template>
  <div class="comment-container">
    <ul class="ul">
      <li v-for="item of list" :key="item._id" class="li">
        用户
        <router-link
          class="link"
          :to="{ name: 'user', params: { id: item.fromId } }"
          >{{ item.fromName }}</router-link
        >
        于 {{ item.createTime }} 评论了你
        <p class="content">
          {{ item.content }}
        </p>
      </li>
    </ul>
    <a-pagination
      v-model:current="page"
      :default-page-size="10"
      :total="total"
      size="small"
      show-total
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import {
  getNotificationList,
  updateNotificationReadStatus,
} from '@/api/notification';
import dayjs from 'dayjs';
import { useCommonStore } from '@/store';

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
});

const commonStore = useCommonStore();
const total = ref(0);
const list = ref([]);
const page = ref(1);

const putMessageReadStatus = () => {
  const idList = [];
  for (const item of list.value) {
    if (!item.has_read) {
      idList.push(item._id);
    }
  }
  if (idList.length === 0) return;
  updateNotificationReadStatus({ messages: idList });
  commonStore.setRefetchMessageCount(true);
};

const fetchMessageList = async () => {
  const userId = props.userId;
  if (!userId) return;
  const params = { page: page.value, size: 10, type: [0, 1] };
  const result = await getNotificationList(userId, params);
  total.value = result.total;
  list.value = (result.list || []).map(item => {
    return {
      _id: item._id,
      fromId: item.sender._id,
      fromName: item.sender.name,
      createTime: dayjs(item.create_at).format('YYYY-MM-DD'),
      content: item.content,
      has_read: item.has_read,
    };
  });
  putMessageReadStatus();
};
const handleChange = value => {
  page.value = value;
};

watch(
  () => page.value && props.userId,
  value => {
    if (!value) return;
    fetchMessageList();
  }
);

onBeforeMount(() => fetchMessageList());
</script>

<style lang="less" scoped>
.comment-container {
  padding: 16px;

  .ul {
    margin: 0;
    padding: 0;
    list-style: none;

    .li {
      color: #8a919f;
      padding: 10px 0;

      .content {
        color: #000;
      }
    }

    .link {
      color: #252933;
      cursor: pointer;

      &:hover {
        color: #1e80ff;
      }
    }
  }
}
</style>
