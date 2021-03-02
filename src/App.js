
import './App.css';
import {Admin,Resource} from 'react-admin';
//import jsonServerProvider from 'ra-data-json-server';
import {UserList,UserEdit,UserCreate} from './users';
import myRestProvider from './myRestProvider';
import authProvider from './authProvider';
import customRoutes from './customRoute';
function App() {
  return (
    <>
    
    <Admin customRoutes={customRoutes} dataProvider={myRestProvider} authProvider={authProvider}>
      <Resource name="orders"  list={UserList} edit={UserEdit} create={UserCreate}/>

    </Admin>
    </>
    
  
  );
}

export default App;
