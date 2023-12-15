<template>
  <a-list-item
    class="list-item"
    action-layout="vertical"
    @click.stop="handleClick"
  >
    <template #actions>
      <component
        :is="actionComponent"
        :data="listItem"
        @delete="handleDelete"
      />
    </template>
    <a-list-item-meta>
      <template #title>
        <h3 class="title">{{ listItem.title }}</h3>
      </template>
      <template #description>
        <p class="description">{{ listItem.description }}</p>
      </template>
    </a-list-item-meta>
  </a-list-item>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import DefaultAction from './default-action.vue';
import AuthorAction from './author-action.vue';

const props = defineProps({
  item: {
    type: Object,
    default() {
      return {};
    },
  },
  type: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['delete']);

const router = useRouter();
const listItem = computed(() => props.item);
const actionComponent = computed(() => {
  const actionType = props.type;
  return actionType === 0 ? DefaultAction : AuthorAction;
});

const handleDelete = data => emit('delete', data);
const handleClick = () => {
  const item = listItem.value;
  const { href } = router.resolve({
    name: 'article',
    params: { id: item._id },
  });
  window.open(href, '__blank');
};
</script>

<style lang="less" scoped>
.list-item {
  display: flex;
  cursor: pointer;

  :deep(.arco-list-item-main) {
    max-width: 600px;
    overflow: hidden;
  }

  .avator {
    display: inline-block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .image {
    display: inline-block;
    width: 110px;
    height: 74px;
    object-fit: contain;
  }

  .title {
    margin: 0;
    max-width: 400px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #252933;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .description {
    display: block;
    margin: 0;
    max-width: 600px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #8a919f;
    font-size: 13px;
  }
}
</style>
