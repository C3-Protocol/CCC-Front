import axios from 'axios'

// axios instance
const service = axios.create({
  baseURL: 'https://web-backend.c3-protocol.com/api/v1/ccc',
  timeout: 50 * 1000 // request timeout
})

// request
service.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error)
  }
)

// response
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // console.log('res:', res)
    return res
  },
  (error) => {
    console.log('error:', error)
    return Promise.reject(error)
  }
)

//get
export function $get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params
      })
      .then((res) => {
        resolve(res) //data
      })
      .catch((err) => {
        reject(err)
      })
  })
}

//post
export function $post(url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
