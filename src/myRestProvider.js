
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = process.env.REACT_APP_API_URL;
const httpClient = (url, options = {}) => {
    //this code for accept data only json format
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
        
    }
    try{
    const token = JSON.parse(localStorage.getItem('auth'));
    //console.log("tt",token);
    options.headers.set('Authorization', `Bearer ${token['access_token']}`);
    }catch(err){
        //console.log(err);
      
        
    }
    
    options.credentials = 'include';
    
    return fetchUtils.fetchJson(url, options);
  };
//const httpClient = fetchUtils.fetchJson;

export default {
    //send get request /orders endpoitn with 3 parameter
    //range, filter and sort and expect multiple array of record after success
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        
        const query = {
             sort: JSON.stringify([field, order]),
             range: JSON.stringify([(page - 1) * perPage,perPage]),
             filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) =>{
            console.log("pp",json);
            if(json.status == 403 || json.status == 401)
             //console.log("llg")
            throw new Error("no access");
            return (
            {
            data: json,
            total: parseInt(headers.get('X-Total-Count').split('/').pop(), 10),
            });
         }
        
        ).catch(()=>Promise.reject());
    },


    //send post request with single data record
    //and expect saved data in json format after success
    create:(resource,params)=>{
        const url = `${apiUrl}/${resource}`;

        return httpClient(url,
            {
                method:'POST',
                body:JSON.stringify(params.data),
            })
            .then(({json}) =>{
               // console.log("pp2",json);

                return({
                    data:{...params.data,id:json[0].id},
                });
            });
        

    },
    //send post request to /order endpoint with sigle json data
    //and expects updated single data in json format after success
    update:(resource,params)=>{
        const url=`${apiUrl}/${resource}/${params.id}`;
        return httpClient(url,{
            method:'POST',
            body:JSON.stringify(params.data),
        })
        .then(({json})=>({
            data:{...params.data,id:json.id},
        }));
    },

    //send delete request /orders endpoint
    //exepects deleted data in json format
    delete:(resource,params)=>{
        const url=`${apiUrl}/${resource}/${params.id}`;
        return httpClient(url,{method:'DELETE'})
        .then(({json})=>({
            data:{...params.data,id:json.id},
        }));
    },

    //this method send get /orders/{id}
    //here id is dynamic 
    // expects single data in json format
    getOne:(resource,params)=>{
        const url=`${apiUrl}/${resource}/${params.id}`;
        return httpClient(url)
        .then(({json})=>({
            data:json,
        }));

    }

}