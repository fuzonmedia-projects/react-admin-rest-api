
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = "http://localhost:3000";
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    //const token = localStorage.getItem('token');
    //options.headers.set('Authorization', `Bearer ${token}`);
    options.credentials = 'include';
    
    return fetchUtils.fetchJson(url, options);
  };


  const authProvider = {
    // authentication
    login: ({username,password}) => {
        const request = new Request(`${apiUrl}/login`, {
            method: 'POST',
            body: JSON.stringify({ email:username, password:password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                localStorage.setItem('auth', JSON.stringify(auth));
            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    // ...
    
    checkError: error => {
       console.log("eA",localStorage.getItem('auth'))
        const status = error.status;
        if (localStorage.getItem('auth')) {
            localStorage.removeItem('auth');
            return Promise.reject(new Error("please"));
        }
        
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    checkAuth: params =>{
        console.log("cA",localStorage.getItem('auth'))
        if(localStorage.getItem('auth'))
        return Promise.resolve() ;
        return Promise.reject();
     },
    logout: () =>{
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    getIdentity: () => Promise.resolve(),
    // authorization
    getPermissions: params => Promise.reject(),
};

export default authProvider;