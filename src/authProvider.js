
const apiUrl = process.env.REACT_APP_API_URL;

  const authProvider = {
    // this method send post request to /login endpoint 
    // and expects status 200 for success and 403 for login fails
    login: ({username,password}) => {
        console.log('url',process.env.REACT_APP_API_URL);
        const request = new Request(`${apiUrl}/login`, {
            method: 'POST',
            body: JSON.stringify({ email:username, password:password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
               
                if (response.status < 200 || response.status >= 300) {
                    if(response.status == 403)
                    throw new Error("Wrong username password");
                    else
                    throw new Error("Network error");
                  
                 }
                return response.json();
            })
            .then(auth => {
                localStorage.setItem('auth', JSON.stringify(auth));
            })
            .catch((e) => {
                console.log("df",e);
                throw new Error(e.message);
            });
    },
    
    //this method run when dataprovider throw an error

    checkError: error => {
        
        
        if (localStorage.getItem('auth')) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }

        
        
        return Promise.resolve();
    },

    //check if user is authenticate when use access any routes
    checkAuth: params =>{
    
        if(localStorage.getItem('auth'))
        return Promise.resolve() ;
        return Promise.reject(new Error("Login First"));
     },

    //click on logout button call this method
    logout: () =>{
        

        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    getIdentity: () => Promise.resolve(),
   
    getPermissions: params => Promise.reject(),
};

export default authProvider;