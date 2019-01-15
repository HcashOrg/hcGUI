import axios from 'axios';

// axios.defaults.timeout = 5000;
const CSRF_TOKEN_HEADER = "x-csrf-token"; // must always be lowercase



// //http request Interceptor
// axios.interceptors.request.use(
//   config => {
//     config.data = JSON.stringify(config.data);
//     config.headers = {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(err);
//   }
// );

//Response interceptor, exception handling
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('Wrong request')
        break;
      case 401:
        console.log('Unauthorized, please login again')
        break;
      case 403:
        console.log('access denied')
        break;
      case 404:
        console.log('Request error, the resource was not found')
        break;
      case 405:
        console.log('Request method not allowed')
        break;
      case 408:
        console.log('request timeout')
        break;
      case 500:
        console.log('Server-side error')
        break;
      case 501:
        console.log('Network not implemented')
        break;
      case 502:
        console.log('network error')
        break;
      case 503:
        console.log('Service unavailability')
        break;
      case 504:
        console.log('Network Timeout')
        break;
      case 505:
        console.log('HTTP version does not support this request')
        break;
      default:
        console.log(`Connection error ${err.response.status}`)
    }
  } else {
    console.log('Failed to connect to server')
  }
  console.log(err, " Response interceptor, exception handling ")
  return Promise.reject(err)
})
let CSRFPromise = null;
function ensureCSRF(piURL) {
  if (!CSRFPromise) {
    CSRFPromise = axios.get(piURL + "/");
  }
  return CSRFPromise;
}

/**
 * get
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(piURL, path, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(piURL + path, {
      params: params
    }).then(response => {
      resolve(response);
    })
      .catch(err => {
        console.log(`error: Response interceptor ${piURL}${path}  ${err}`)
        reject(err)
      })


  })
}


/**
 * post
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(piURL, path, data = {}) {
  return new Promise((resolve, reject) => {


    ensureCSRF(piURL).then(resp => {
      let cfg = {};
      if (resp.headers[CSRF_TOKEN_HEADER]) {
        cfg = {
          headers: {
            [CSRF_TOKEN_HEADER]: resp.headers[CSRF_TOKEN_HEADER]
          }
        };
      }
 
      return axios.post(piURL + path, data, cfg);
    }).then(response => { 
      resolve(response);
    }, err => {
      console.log(` error: Response interceptor  ${piURL}${path}  ${err}`)
      reject(err)
    })

    // axios.post(url, data)
    //   .then(response => {
    //     resolve(response);
    //   }, err => {
    //     reject(err)
    //   })
  })
}

/**
* patch
* @param url
* @param data
* @returns {Promise}
*/

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
  })
}

/**
* put
* @param url
* @param data
* @returns {Promise}
*/

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
  })
}



