<template>
  <div>
    <a-avatar v-if="avatar" :size="size">
      <img :src="avatar" alt="avatar" />
    </a-avatar>
    <a-avatar v-else :size="size">
      <icon-user></icon-user>
    </a-avatar>
  </div>
</template>

<script setup>
import { toRef } from 'vue';
import { IconUser } from '@arco-design/icon-vue';

const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 40,
  },
});

const avatar = toRef(() => props.avatar);
const size = toRef(() => props.size);
</script>
