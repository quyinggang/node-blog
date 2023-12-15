<template>
  <div class="action-container">
    <span class="action name" @click.stop="handleClick">{{
      detail.author ? detail.author.name : ''
    }}</span>
    <span class="action"><icon-eye /> {{ detail.read_count || 0 }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconEye } from '@arco-design/icon-vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});
const router = useRouter();
const detail = computed(() => props.data);

const handleClick = () => {
  const { author } = detail.value;
  if (!author || !author._id) return;
  router.push({ name: 'user', params: { id: author._id } });
};
</script>

<style lang="less" scoped>
.action-container {
  .action {
    color: #8a919f;

    &:not(:last-child) {
      margin-right: 1em;
    }
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: #1e80ff;
    }
  }
}
</style>
