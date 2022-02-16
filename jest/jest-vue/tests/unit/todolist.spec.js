import { shallowMount } from '@vue/test-utils'
import todolist from '../../src/container/ToDoList/ToDoList'
import UnDoList from '../../src/container/ToDoList/components/UnDoList.vue'
// import Header from '../../src/container/ToDoList/components/header.vue'

it ('todolis初始化的时候，undolist应该为空数组', () => {
    const wrapper = shallowMount(todolist);
    const undolist = wrapper.vm.$data.undolist;
    expect(undolist).toEqual([]);
})

it('todolist监听到header的add方法时，增加一个内容', () => {
   /* const wrapper = shallowMount(todolist);
    const header = wrapper.find(Header);
    header.vm.$emit('add', '皇帝');
    const undolist = wrapper.vm.$data.undolist;
    expect(undolist).toEqual(['皇帝']);*/
    const wrapper = shallowMount(todolist);
    wrapper.setData({
        undolist: [1, 2, 3]
    })
    wrapper.vm.addUnDoItem(4);
    expect(wrapper.vm.$data.undolist).toEqual([1, 2, 3, 4]);
})

it('todolist调用undolist应该传递list参数', () => {
    const wrapper = shallowMount(todolist);
    const undolist = wrapper.find(UnDoList);
    const list = undolist.props('list');
    expect(list).toBeTruthy();
})

it('todolist的handleItemDelete被调用时，undolist就会少一项内容', () => {
    const wrapper = shallowMount(todolist);
    wrapper.setData({
        undolist: [1, 2, 3]
    })
    wrapper.vm.handleItemDelete(1);
    expect(wrapper.vm.$data.undolist).toEqual([1, 3]);
})