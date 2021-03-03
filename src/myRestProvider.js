
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = "http://localhost:3000";
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    try{
    const token = JSON.parse(localStorage.getItem('auth'));
    console.log("tt",token);
    options.headers.set('Authorization', `Bearer ${token['access_token']}`);
    }catch(err){
        console.log(err);
        
    }
    
    options.credentials = 'include';
    
    return fetchUtils.fetchJson(url, options);
  };
//const httpClient = fetchUtils.fetchJson;

export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        console.log("efok")
        const query = {
             sort: JSON.stringify([field, order]),
             range: JSON.stringify([(page - 1) * perPage,perPage]),
             filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) =>{
            console.log("pp",json);
            if(json.status === 403)
            throw new Error("no access");
            return (
            {
            data: json,
            total: parseInt(headers.get('X-Total-Count').split('/').pop(), 10),
            });
         }
        
        ).catch(()=>Promise.reject(new Error("cant access this page")));
    },
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
    delete:(resource,params)=>{
        const url=`${apiUrl}/${resource}/${params.id}`;
        return httpClient(url,{method:'DELETE'})
        .then(({json})=>({
            data:{...params.data,id:json.id},
        }));
    },
    getOne:(resource,params)=>{
        const url=`${apiUrl}/${resource}/${params.id}`;
        return httpClient(url)
        .then(({json})=>({
            data:json,
        }));

    }

}