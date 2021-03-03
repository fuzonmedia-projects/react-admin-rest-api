import React from "react";
import {SearchInput,Filter, List, Datagrid,TextField,SimpleForm,TextInput,Create,Edit} from 'react-admin';

const PostFilter=(props)=>(<Filter {...props} >
    <SearchInput  source="q" alwaysOn />
    
  </Filter>);


export const UserList = props => (
    <List  {...props} filters={<PostFilter/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="order_number" label="Order Number"/>
            <TextField source="order_ammt" label="Order Ammount"/>
            
        </Datagrid>
    </List>
);

export const UserCreate = props => (
    <Create {...props}>
      <SimpleForm>
        
        <TextInput source="order_number" />
        <TextInput source="order_ammt" />
        
      </SimpleForm>
    </Create>
  );

  export const UserEdit = props => (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled label="Id" source="id" />
        <TextInput source="order_number" />
        <TextInput source="order_ammt" />
        
      </SimpleForm>
    </Edit>
  );