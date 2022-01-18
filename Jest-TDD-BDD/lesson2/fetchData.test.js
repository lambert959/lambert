import { fetchData, fetchData1, fetchData2 } from './fectchData';

test('fetchData的结果', (done) => {
    fetchData((data) => {
        expect(data).toEqual({
            success: true
        })
        done();
    })
})

test('fetchData1的结果', () => {
    return fetchData1().then((response) => {
        expect(response.data).toEqual({
            success: true
        })
    })
})

test('fetchData2的结果', () => {
    expect.assertions(1);
    return fetchData2().catch((e) => {
        expect(e.toString().indexOf('404') > -1).toBe(true);
    })
})

test('fetchData1的结果', () => {
    return expect(fetchData1()).resolves.toMatchObject({
        data: {
            success: true
        }
    })
})

test('fetchData2的结果', () => {
    return expect(fetchData2()).rejects.toThrow();
})

test('fetchData2的结果', async () => {
    await expect(fetchData2()).rejects.toThrow();
})

test('fetchData1的结果', async () => {
    await expect(fetchData1()).resolves.toMatchObject({
        data: {
            success: true
        }
    })
})

test('fetchData1的结果', async () => {
    const response = await fetchData1();
    expect(response.data).toEqual({
        success: true
    })
})

test('fetchData2的结果', async () => {
    expect.assertions(1);
    try{
        await fetchData2();
    } catch (e) {
        expect(e.toString()).toEqual('Error: Request failed with status code 404')
    }
})
