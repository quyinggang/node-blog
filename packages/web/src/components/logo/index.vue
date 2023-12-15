<template>
  <a-link class="logo" href="/" :hoverable="false">
    <img class="image" src="/vite.svg" />
    <h2>探索社区</h2>
  </a-link>
</template>

<style lang="less" scoped>
.logo {
  display: flex;
  align-items: center;
  color: #000;

  .image {
    width: 18px;
    height: 18px;
    margin-right: 3px;
  }
}
</style>
