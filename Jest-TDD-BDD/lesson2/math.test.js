/*const math = require('./math');
const { add, minus } = math;*/
import { add, minus  } from './math';

test('测试加法', () => {
    expect(add(3, 3)).toBe(6);
})

test('测试减法', () => {
    expect(minus(4, 3)).toBe(1);
})
// https://www.zip118.com/324715482_1222/206427.html