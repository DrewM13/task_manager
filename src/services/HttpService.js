import axios from 'axios'

const http = axios.create({
  baseURL: "https://localhost:7262/api"
})

http.defaults.headers.post['Content-Type'] = 'application/json'
http.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

http.interceptors.request.use(
  config => {
    const token = localStorage.getItem("jwtoken")
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  response => Promise.reject(response)
)

http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 403) {
      window.location.href = "http://localhost:8080/login"
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export { http }







// import axios from 'axios'
// export default{
//   Data(){
//     return{


//       token: localStorage.getItem("jwtoken"),
//       baseURL: "https://localhost:7262/api",
//       instance: axios.create({
//         baseURL: baseURL,
//         timeout: 1000,
//         headers: {'Authorization': token}
//       })
//     }
//   }
  // instance.interceptors.request.use(
  //   (config) => {
  //     if (this.logindt != null) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

