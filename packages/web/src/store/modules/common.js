import { defineStore } from 'pinia';

const useCommonStore = defineStore('common', {
  state: () => {
    return {
      loginModelVisible: false,
      refetchUserMessageCount: false,
    };
  },
  getters: {
    loginVisible: (state) => state.loginModelVisible,
    refetchMessageCount: (state) => state.refetchUserMessageCount,
  },
  actions: {
    setLoginVisible(visible) {
      this.loginModelVisible = !!visible;
    },
    setRefetchMessageCount(value) {
      this.refetchUserMessageCount = !!value;
    },
  },
});

export default useCommonStore;
