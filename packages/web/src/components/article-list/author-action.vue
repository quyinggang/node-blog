<template>
  <a-space>
    <span class="action">{{ detail.createTime }}</span>
    <span class="action"><icon-eye />{{ detail.read_count || 0 }}</span>
    <a-dropdown trigger="hover">
      <icon-more />
      <template #content>
        <a-doption @click.stop="handleRoute">编辑</a-doption>
        <a-doption @click.stop="handleDelete">删除</a-doption>
      </template>
    </a-dropdown>
  </a-space>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { IconEye, IconMore } from '@arco-design/icon-vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});
const emit = defineEmits(['delete']);

const router = useRouter();
const detail = computed(() => {
  const info = props.data || {};
  return { ...info, createTime: dayjs(info.create_at).format('YYYY-MM-DD') };
});

const handleRoute = () => {
  const item = detail.value;
  if (!item) return;
  const { href } = router.resolve({
    name: 'editor-edit',
    params: { id: item._id },
  });
  window.open(href, '__blank');
};
const handleDelete = () => {
  const item = detail.value;
  if (!item) return;
  emit('delete', item._id);
};
</script>

<style lang="less" scoped>
.action {
  color: #8a919f;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
