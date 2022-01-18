import timer from './timer';

beforeEach(() => {
    jest.useFakeTimers(); // 每次执行测试用例都初始化一下
})

test('测试定时器', () => {
    const fn = jest.fn();
    timer(fn);
   // jest.runAllTimers();
   // jets.runOnlyPendingTimers();
    jest.advanceTimersByTime(3000);
    expect(fn).toHaveBeenCalledTimes(1);
})