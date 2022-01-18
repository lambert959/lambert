import Counter from "./counter";

describe('整体测试代码', () => {
    let counter = null;
    beforeAll(() => {
        console.log('beforeAll');
    })
    afterAll(() => {
        console.log('afterAll');
    })
    beforeEach(() => {
        console.log('beforeEach');
        counter = new Counter;
    })
    afterEach(() => {
        console.log('afterEach');
    })
    describe('测试增加的代码', () => {
        test('测试+1', () => {
            counter.addOne();
            expect(counter.num).toBe(1);
        })
        test('测试+2', () => {
            counter.addTwo();
            expect(counter.num).toBe(2);
        })        
    })
    describe('测试减少的代码', () => {
        test('测试-1', () => {
            counter.minusOne();
            expect(counter.num).toBe(-1);
        })
        test('测试-2', () => {
            counter.minusTwo();
            expect(counter.num).toBe(-2);
        })        
    })
})