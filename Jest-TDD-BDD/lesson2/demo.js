import Axios from "axios";

export const runCallback = (callback) => {
    callback();
}

export const createObject = (classItem) => {
    new classItem();
}

export const getData = () => {
    return Axios.get('/api').then((res) => res.data);
}

export const generateConfig = () => {
    return {
        server: 'http://localhost',
        time: new Date()
    }
}