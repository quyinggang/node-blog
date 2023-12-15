import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => {
    return {
      loggedIn: false,
      userDetail: null,
    };
  },
  getters: {
    isLoggedIn: (state) => state.loggedIn,
    userInfo: (state) => state.userDetail,
  },
  actions: {
    setLoggedIn(value) {
      this.loggedIn = !!value;
    },
    setUserInfo(detail) {
      this.userDetail = detail;
    },
  },
});

export default useUserStore;
