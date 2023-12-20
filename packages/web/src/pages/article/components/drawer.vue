<template>
  <a-drawer
    class="comment-drawer"
    :width="400"
    :visible="drawerVisible"
    :footer="false"
    @cancel="handleCancel"
  >
    <template #title>评论 {{ commentCount }}</template>
    <comment
      v-if="drawerVisible"
      :preview="false"
      :topic-id="articleId"
      @success="fetchCommentTotal"
    ></comment>
  </a-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getCommentCount } from '@/api/comment';
import Comment from '@/components/comment/index.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  articleId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);

const commentCount = ref(0);

const articleId = computed(() => props.articleId);
const drawerVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const fetchCommentTotal = async () => {
  const topicId = articleId.value;
  if (!topicId) return;
  const data = await getCommentCount({ topicId });
  commentCount.value = data;
};

watch(
  () => drawerVisible.value && articleId.value,
  async value => {
    if (!value) return;
    fetchCommentTotal();
  }
);

const handleCancel = () => {
  drawerVisible.value = false;
};
</script>
