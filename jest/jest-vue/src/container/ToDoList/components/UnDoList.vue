<template>
  <div class="undocontent">
    <div data-test="count" class="title">
      <span> 正在进行： </span>
      <span>  {{list.length}} </span>
    </div>
    <ul>
        <li v-for="(item, index) in list" :key="index" data-test="item" class="undoitem">
            {{item}}
            <span data-test="delete-button" @click="handleDelete(index)" class="delete">-</span>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UnDoList',
  props: ['list'],
  methods: {
    handleDelete (index) {
      console.log(index)
      this.$emit('delete', index)
    }
  }
}
</script>

<style scoped lang="stylus">
  .undocontent {
    width: 600px;
    margin 10px auto;
  }
  .title {
    display: flex;
    justify-content: space-between;
  }
  .undoitem {
    margin-top 20px;
    background-color: #fff;
    list-style-type: none;
    font-size: 24px;
    border-radius: 5px;
    text-indent: 20px;
  }
  .delete {
    float: right;
    margin-right: 20px;
    cursor: pointer;
  }
</style>
