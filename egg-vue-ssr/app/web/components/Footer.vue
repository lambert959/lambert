<template>
  <el-footer class="footer">
    Copyright 2021 PAX Technology. All Rights Reserved. {{ version }}
  </el-footer>
</template>
<script>
export default {
  props: ['version'] // version不能写为version
}
</script>
<style lang="scss" scoped>
    .footer{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: transparent;
        font-size: 12px;
        color: #999;
        text-align: center;
        line-height: 60px;
    }
</style>
