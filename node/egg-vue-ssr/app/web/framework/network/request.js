
import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 15000
axios.defaults.xsrfHeaderName = 'x-csrf-token'
axios.defaults.xsrfCookieName = 'csrfToken'
// axios.defaults.headers = { 'Accept-Language': 'en' }
export default {
  post (url, params) {
    return axios.post(url, params).then((res) => res.data)
  },
  get (url, params) {
    return axios.get(url, { params }).then((res) => res.data)
  },
  put (url, params) {
    return axios.put(url, params).then((res) => res.data)
  },
  delete (url, params) {
    return axios.delete(url, { params }).then((res) => res.data)
  }
}
