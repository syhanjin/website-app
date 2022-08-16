import uni_request from '@/js_sdk/uni_request/uni_request.js'
import store from './store'

export var baseURL
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://127.0.0.1/api/v1'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://sakuyark.com/api/v1'
}
const request = uni_request({
  baseURL: baseURL,
  statusCode: [200, 201],
  // ssl
})


request.interceptors.request.use(async (config, ...args) => {
  // await new Promise(resolve => setTimeout(() => resolve(), 3000))
  // config.
  if (store.state.isAuthenticated) {
    config.header.Authorization = 'Token ' + store.state.token
  }
  return config
})

// request.interceptors.response.use((response, ...args) => {

//   return response
// })

export default request
