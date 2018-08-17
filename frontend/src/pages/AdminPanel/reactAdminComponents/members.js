import React from 'react';
import { Create, Datagrid, DateInput, DateField, DisabledInput, Edit, EditButton, List, TextField, TextInput, SimpleForm, } from 'react-admin';

export const MemberList = (props) => (
    <List
      title="Membres"
      {...props}
    >
        <Datagrid>
          <TextField source="firstName" label="Prénom" />
          <TextField source="lastName" label="Nom" />
          <DateField source="birthday" label="Date de naissance" />
          <TextField source="id" />
          <EditButton />
        </Datagrid>
    </List>
);

const MemberTitle = ({ record }) => (<span>Membre {record ? `"${record.firstName} ${record.lastName}"` : ''}</span>);

export const MemberEdit = (props) => (
  <Edit title={<MemberTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="lastName" label="Nom" type="url" />
      <DateInput source="birthday" label="Date de naissance" />
    </SimpleForm>
  </Edit>
);

// <ReferenceInput label="User" source="userId" reference="users">
//     <SelectInput optionText="name" />
// </ReferenceInput>

export const MemberCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="lastName" label="Nom" type="url" />
      <DateInput source="birthday" label="Date de naissance" />
    </SimpleForm>
  </Create>
);
