<template>
  <div class="hello">
      <Header @add='addUnDoItem'/>
      <UnDoList :list="undolist" @delete="handleItemDelete" />
  </div>
</template>

<script>
import Header from './components/header'
import UnDoList from './components/UnDoList'

export default {
  name: 'ToDoList',
  components: {
    Header,
    UnDoList
  },
  data () {
    return {
      undolist: []
    }
  },
  methods: {
    addUnDoItem (inputValue) {
      this.undolist.push(inputValue)
      console.log(this.undolist)
    },
    handleItemDelete (index) {
      this.undolist.splice(index, 1)
      console.log(this.undolist)
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
