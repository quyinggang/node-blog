<template>
  <div class="container">
    <div class="content">
      <article-list></article-list>
    </div>
    <div class="right">
      <div class="card">
        <ul class="left">
          <li class="title">{{ timeTitle }}好！</li>
          <li class="info">点亮在社区的每一天</li>
        </ul>
        <a-button type="outline">去签到</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ArticleList from '@/components/article-list/index.vue';
import { getCurrentTimeTitle } from '@/utils/common';

const timeTitle = computed(() => getCurrentTimeTitle());
</script>

<style lang="less" scoped>
.container {
  display: flex;

  .content {
    flex: 1;
    min-height: 100px;
    background-color: #fff;
    border-radius: 3px;
  }

  .right {
    flex: none;
    width: 260px;
    margin-left: 20px;

    .card {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      line-height: 2;
      background-color: #fff;
      border-radius: 3px;

      .left {
        list-style: none;
        margin: 0;
        padding: 0;
        margin-right: 28px;
      }

      .title {
        font-size: 16px;
        font-weight: bold;
      }

      .info {
        color: #8a919f;
        font-size: 13px;
      }
    }
  }
}
</style>
