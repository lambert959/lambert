<template>
  <div id="app">
    <ToDoList />
  </div>
</template>

<script>
import ToDoList from './container/ToDoList/ToDoList'

export default {
  name: 'App',
  components: {
    ToDoList
  }
}
</script>

<style lang="stylus">
  body {
    background-color: #cdcdcd;
  }
</style>
