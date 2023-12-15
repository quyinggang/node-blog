<template>
  <div :class="['input-container', inputStatusClass]">
    <div v-if="userLoggedIn">
      <div class="input">
        <div
          ref="inputElement"
          class="textarea"
          contenteditable="true"
          :placeholder="placeholder"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
        ></div>
      </div>
      <div class="actions">
        <span class="count">
          <strong>{{ wordCount }}</strong> / 1000
        </span>
        <a-button
          type="primary"
          size="small"
          :disabled="sendDisabled"
          @click.stop="handleCommentSend"
          >发送</a-button
        >
      </div>
    </div>
    <div v-else class="auth-btn">
      <a-button type="primary" @click="handleLogin">登录/注册</a-button>
      <span class="info">即可发布评论</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    default() {
      return {};
    },
  },
  loggedIn: {
    type: Boolean,
    default: false,
  },
  commentArticle: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '平等表达，友善交流',
  },
});
const emit = defineEmits(['login', 'send', 'blur']);

const focusedInput = ref(false);
const wordCount = ref(0);
const inputElement = ref();

const placeholder = computed(() => props.placeholder);
const userLoggedIn = computed(() => props.loggedIn);
const sendDisabled = computed(() => wordCount.value <= 0);
const inputStatusClass = computed(() => {
  return {
    focused: focusedInput.value,
    'not-empty': wordCount.value > 0,
  };
});

const clearInput = () => {
  const inputEle = inputElement.value;
  if (!inputEle) return;
  inputEle.textContent = '';
  wordCount.value = 0;
};
const focusInput = () => {
  const inputEle = inputElement.value;
  if (!inputEle) return;
  inputEle.focus();
};
const handleBlur = () => {
  focusedInput.value = false;
  const isExistContent = wordCount.value > 0;
  emit('blur', isExistContent);
};
const handleFocus = () => {
  focusedInput.value = true;
};
const handleInput = e => {
  wordCount.value = e.target.textContent.length;
};
const handleLogin = () => {
  emit('login');
};
const handleCommentSend = () => {
  const inputEle = inputElement.value;
  if (!inputEle) return;
  const content = inputEle.textContent.trim();
  if (!content.length) return;
  emit('send', { content });
};

defineExpose({ clearInput, focusInput });
</script>

<style lang="less" scoped>
.input-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  min-height: 84px;
  background: #f2f3f5;
  border-radius: 3px;

  .auth-btn {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .info {
      padding-left: 5px;
    }
  }

  .input {
    position: relative;
    flex: 1;
    padding: 8px 12px;
    min-height: 44px;
    max-height: none;
    color: #515767;
    font-size: 16px;
    box-sizing: border-box;
    overflow: auto;
    transition: all 0.3s;

    .textarea {
      position: relative;
      line-height: 22px;
      outline: none;

      &::before {
        content: attr(placeholder);
        position: absolute;
        color: #8a919f;
        user-select: none;
        pointer-events: none;
      }
    }
  }

  .actions {
    flex: none;
    height: 40px;
    line-height: 40px;
    color: #8a919f;
    text-align: right;
    padding: 0 12px 0 6px;
    box-sizing: border-box;

    .count {
      padding-right: 10px;
    }
  }
}

.focused {
  outline: 1px solid #1e80ff;
  background: #fff;

  .input {
    min-height: 100px;
    max-height: 300px;
  }
}

.not-empty {
  .input {
    .textarea {
      &::before {
        display: none;
      }
    }
  }
}
</style>
