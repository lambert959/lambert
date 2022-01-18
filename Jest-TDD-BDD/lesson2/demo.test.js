import axios from 'axios';
import {createObject, runCallback, getData, generateConfig} from './demo';
jest.mock('axios');

test('执行回调函数1', () => {
    const func = jest.fn(); // 生成mock函数
    runCallback(func); // 执行mock函数
    expect(func).toBeCalled(); // 查看是否已经执行mock函数
})

test('执行回调函数2', () => {
    const func = jest.fn(() => {
        return '456';
    });
    runCallback(func);
    expect(func.mock.calls.length).toBe(1);
})

test('执行回调函数3', () => {
    const func = jest.fn();
    func.mockReturnValueOnce('freeman');
    runCallback(func);
    expect(func.mock.results[0].value).toBe('freeman');
})

test.only('执行异步函数', async () => {
    axios.get.mockResolvedValue({data: 'success'});
    await getData().then((data) => {
        expect(data).toBe('success');
    })
})

test.only('测试配置文件', () => {
    expect(generateConfig()).toMatchSnapshot(
        {
            time: expect.any(Date)
        }
    );
})