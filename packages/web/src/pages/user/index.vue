<template>
  <div class="container">
    <div class="left">
      <div class="user-info">
        <a-avatar class="avatar" :size="90">
          <img
            class="image"
            alt="avatar"
            :src="userInfo.avatar"
            loading="lazy"
          />
        </a-avatar>
        <a-space direction="vertical" size="large">
          <strong class="name">{{ userInfo.name }}</strong>
          <follow-action
            v-if="followVisible"
            :user-id="uid"
            @follow-success="handleFollowSuccess"
            @cancel-success="handleFollowSuccess"
          ></follow-action>
        </a-space>
      </div>
      <div class="tab-container">
        <a-tabs lazy-load destroy-on-hide>
          <a-tab-pane key="1" title="文章"
            ><article-list :uid="uid" :type="articleListType"></article-list
          ></a-tab-pane>
          <a-tab-pane key="2" title="关注"
            ><following-list :uid="uid"></following-list
          ></a-tab-pane>
          <a-tab-pane key="3" title="粉丝">
            <follower-list :uid="uid"></follower-list
          ></a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="right">
      <a-space direction="vertical" :size="20" fill>
        <a-card class="card" :bordered="false">
          <div class="flex">
            <strong>关注数</strong>
            <span>{{ userInfo.followingCount }}</span>
          </div>
          <div class="flex">
            <strong>粉丝数</strong>
            <span>{{ userInfo.followerCount }}</span>
          </div>
        </a-card>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import { getUserAllInfo } from '@/api/user';
import FollowAction from '@/components/follow-action/index.vue';
import ArticleList from '@/components/article-list/index.vue';
import FollowingList from './components/following-list.vue';
import FollowerList from './components/follower-list.vue';

const route = useRoute();
const userStore = useUserStore();
const userInfo = ref({});
const uid = route.params.id;
const followVisible = computed(() => {
  const userDetail = userStore.userInfo || {};
  return userDetail && uid ? userDetail.uid !== uid : false;
});
const articleListType = computed(() => (followVisible.value ? 0 : 1));

const fetchUserInfo = async () => {
  if (!uid) return;
  const data = await getUserAllInfo(uid);
  userInfo.value = { ...data };
};

fetchUserInfo();

const handleFollowSuccess = () => fetchUserInfo();
</script>

<style lang="less" scoped>
.container {
  display: flex;

  .left {
    flex: 1;

    .user-info {
      display: flex;
      align-items: center;
      padding: 20px;
      background: #fff;
    }

    .avatar {
      margin-right: 24px;
    }

    .name {
      font-size: 20px;
      line-height: 22px;
    }

    .tab-container {
      margin-top: 20px;
      background: #fff;
    }
  }

  .right {
    width: 260px;
    margin-left: 20px;
  }

  .card {
    :deep(.arco-card-body) {
      display: flex;
      padding: 10px 20px;
      justify-content: space-around;

      .flex {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 26px;
      }

      strong {
        font-size: 16px;
      }
    }
  }
}
</style>
