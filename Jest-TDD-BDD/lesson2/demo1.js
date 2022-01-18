import axios from "axios"
import $ from 'jquery';

export const fetchData = () => {
    return axios.get('/').then((res) => res.data);
}

export const getNumber = () => {
    return 123
}

export const addDiv = () => {
    $('body').append('<div/>');
}