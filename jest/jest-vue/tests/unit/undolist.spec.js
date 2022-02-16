import { shallowMount } from '@vue/test-utils'
import undolist from '../../src/container/ToDoList/components/UnDoList'
import { findTestWrapper } from '../../src/utils/testUtils'

it('undolist参数为[]的时候，count计数为0且列表没有内容', () => {
    const wrapper = shallowMount(undolist, {
        propsData: {
            list: []
        }
    });
    const countElem = findTestWrapper(wrapper, 'count');
    const listItems = findTestWrapper(wrapper, 'item');
    expect(countElem.at(0).text()).toEqual('0');
    expect(listItems.length).toEqual(0);
})

it('undolist参数为[1,2,3]的时候，count计数为3且列表有内容,且有删除按钮', () => {
    const wrapper = shallowMount(undolist, {
        propsData: {
            list: [1, 2, 3]
        }
    });
    const countElem = findTestWrapper(wrapper, 'count');
    const listItems = findTestWrapper(wrapper, 'item');
    const deleteButtons = findTestWrapper(wrapper, 'delete-button');
    expect(countElem.at(0).text()).toEqual('3');
    expect(listItems.length).toEqual(3);
    expect(deleteButtons.length).toEqual(3);
})

it('undolist第二个删除按钮被点击的时候向外触发一个删除事件', () => {
    const wrapper = shallowMount(undolist, {
        propsData: {
            list: [1, 2 ,3]
        }
    });
    const deleteButton = findTestWrapper(wrapper, 'delete-button').at(1); // 拿到第二个删除按钮
    deleteButton.trigger('click');
    expect(wrapper.emitted().delete).toBeTruthy();
})