import { shallowMount } from '@vue/test-utils'
import Header from '../../src/container/ToDoList/components/header'
import { findTestWrapper } from '../../src/utils/testUtils'

it('header样式发生改变，做提示', () => {
    const wrapper = shallowMount(Header);
    expect(wrapper).toMatchSnapshot();
})

it ('header包含input框', () => {
    const wrapper = shallowMount(Header);
   // const input = wrapper.find('[data-test = "input"]');
    const input = findTestWrapper(wrapper, 'input');
    expect(input.exists()).toBe(true);
})

it('header输入框内容初始化为空', () => {
    const wrapper = shallowMount(Header);
    const inputValue = wrapper.vm.$data.inputValue;
    expect(inputValue).toBe('');
})

it('header中数据发送变化时，input也跟着变', () => {
    const wrapper = shallowMount(Header);
    const input = wrapper.find('[data-test = "input"]');
    input.setValue('皇帝');
    const inputValue = wrapper.vm.$data.inputValue;
    expect(inputValue).toBe('皇帝');
})

it ('header输入为空时回车应该没有反应', () => {
    const wrapper = shallowMount(Header);
    const input = wrapper.find('[data-test = "input"]');
    input.setValue('');
    input.trigger('keyup.enter');
    expect(wrapper.emitted().add).toBeFalsy();
})

it('header中输入有内容回车触发事件且清空输入内容', () => {
    const wrapper = shallowMount(Header);
    const input = wrapper.find('[data-test = "input"]');
    input.setValue('灰骑士');
    input.trigger('keyup.enter');
    expect(wrapper.emitted().add).toBeTruthy();
    expect(wrapper.vm.$data.inputValue).toBe('');
})