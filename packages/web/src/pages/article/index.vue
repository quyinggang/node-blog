<template>
  <div class="article-container">
    <div class="content">
      <article class="article">
        <h1>{{ article.title }}</h1>
        <a-Space :size="20">
          <span class="link" @click.stop="handleUserRoute">{{
            authorInfo.name
          }}</span>
          <span class="info">{{ article.create_at }}</span>
          <span class="info"><icon-eye /> {{ article.read_count }}</span>
        </a-Space>

        <Viewer :value="article.content" :plugins="editorPlugins" />
      </article>
      <div class="comment-container">
        <h3>评论 {{ commentTotal }}</h3>
        <comment
          :topic-id="articleId"
          @success="handleCommentTotalRefetch"
        ></comment>
        <a-button
          v-show="commentTotal"
          class="button"
          long
          @click="handleCommentView"
          >查看全部评论</a-button
        >
      </div>
    </div>
    <div class="right">
      <a-card class="author-card" :bordered="false">
        <author :author-id="authorInfo._id"></author>
      </a-card>
      <a-card class="outline-card" :bordered="false">
        <div ref="outlineElement" class="outline-container"></div>
      </a-card>
    </div>
    <comment-drawer
      v-model="commentDrawerVisible"
      :article-id="articleId"
    ></comment-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconEye } from '@arco-design/icon-vue';
import Comment from '@/components/comment/index.vue';
import Author from './components/author.vue';
import CommentDrawer from './components/drawer.vue';
import { getArticle } from '@/api/article';
import { getCommentCount } from '@/api/comment';
import dayjs from 'dayjs';
import editorConfig from '@/config/editor';
import { Viewer } from '@bytemd/vue-next';
import useOutline from '@/hook/useOutline';

const route = useRoute();
const router = useRouter();
const article = ref({});
const outlineElement = ref();
const commentTotal = ref(0);
const commentDrawerVisible = ref(false);
const authorInfo = computed(() => {
  const articleInfo = article.value;
  const author = articleInfo ? articleInfo.author : {};
  return author ? { _id: author._id, name: author.name } : {};
});
const articleId = route.params.id;

const fetchArticleDetail = async () => {
  if (!articleId) return;
  const [articleResult, commentResult] = await Promise.all([
    getArticle(articleId),
    getCommentCount({ topicId: articleId }),
  ]);
  article.value = {
    ...articleResult,
    create_at: dayjs(articleResult.create_at).format('YYYY-MM-DD HH:mm:ss'),
  };
  commentTotal.value = commentResult || 0;
};
fetchArticleDetail();

const outlinePlugin = useOutline({
  outline: outlineElement,
});
const editorPlugins = [...editorConfig.plugins, outlinePlugin()];

const handleUserRoute = () => {
  const author = authorInfo.value;
  router.push({ name: 'user', params: { id: author._id } });
};
const handleCommentView = () => {
  commentDrawerVisible.value = true;
};
const handleCommentTotalRefetch = async () => {
  const data = await getCommentCount({ topicId: articleId });
  commentTotal.value = data || 0;
};
</script>

<style lang="less" scoped>
@padding-left: 2em;

.article-container {
  display: flex;

  .content {
    flex: 1;
    margin-left: 40px;

    .article {
      padding: 10px 30px;
      background: #fff;
      border-radius: 3px;
    }

    .comment-container {
      margin-top: 40px;
      padding: 10px 30px;
      background: #fff;
      border-radius: 3px;

      .button {
        margin-top: 20px;
      }
    }

    .link {
      color: #515767;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        color: #1e80ff;
      }
    }

    .info {
      color: #8a919f;
    }
  }

  .right {
    flex: none;
    width: 260px;
    margin-left: 20px;

    .author-card {
      margin-bottom: 20px;
    }

    .outline-container {
      padding: 12px 0;

      :deep(.outline-list) {
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 14px;

        .li {
          padding-left: @padding-left;
          margin: 15px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          box-sizing: border-box;
          border-left: 3px solid transparent;

          &:hover {
            color: #1e80ff;
          }
        }

        .pl-1 {
          padding-left: @padding-left + 1em;
        }

        .pl-2 {
          padding-left: @padding-left + 2em;
        }

        .pl-3 {
          padding-left: @padding-left + 3em;
        }

        .pl-4 {
          padding-left: @padding-left + 4em;
        }

        .pl-5 {
          padding-left: @padding-left + 5em;
        }

        .active {
          color: #1e80ff;
          border-left-color: #1e80ff;
        }
      }
    }

    .outline-card {
      :deep(.arco-card-body) {
        padding: 0;
      }
    }
  }
}
</style>
