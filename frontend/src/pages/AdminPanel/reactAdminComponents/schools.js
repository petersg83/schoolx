import React from 'react';
import { Create, Datagrid, DisabledInput, DateField, Edit, EditButton, List, TextField, TextInput, SimpleForm, } from 'react-admin';

export const SchoolList = (props) => (
    <List
      title="Ecoles"
      {...props}
    >
        <Datagrid>
          <TextField source="id" />
          <TextField source="name" label="Nom" />
          <TextField source="urlName" label="Sous domaine" />
          <DateField source="createdAt" label="Créée le" />
          <EditButton />
        </Datagrid>
    </List>
);

const SchoolTitle = ({ record }) => (<span>Ecole {record ? `"${record.name}"` : ''}</span>);

export const SchoolEdit = (props) => (
  <Edit title={<SchoolTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" label="Nom" />
      <TextInput source="urlName" label="Sous domaine" url="url" />
    </SimpleForm>
  </Edit>
);

// <ReferenceInput label="User" source="userId" reference="users">
//     <SelectInput optionText="name" />
// </ReferenceInput>

export const SchoolCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nom" />
      <TextInput source="urlName" label="Sous domaine" url="url" />
    </SimpleForm>
  </Create>
);
