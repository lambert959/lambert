import $ from 'jquery';
jest.mock('./demo1');
import { fetchData } from "./demo1";
const { getNumber, addDiv } = jest.requireActual('./demo1');

test('测试获取数据', () => {
    return fetchData().then((data) => {
        expect(eval(data)).toEqual('123');
    })
})

test('测试数字', () => {
    expect(getNumber()).toEqual(123);
})

test('测试DOM', () => {
    addDiv();
    addDiv();
    expect($('body').find('div').length).toEqual(2);
})