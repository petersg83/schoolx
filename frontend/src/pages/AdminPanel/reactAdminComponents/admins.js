import React from 'react';
import { Create, Datagrid, Edit, EditButton, List, ReferenceField, ReferenceInput, required, TextField, TextInput, SelectInput, SimpleForm } from 'react-admin';

const validateEdit = (values) => {
  const errors = {};
  if (values.password !== values.password2) {
    errors.password2 = ['Les mots de passe ne sont pas identiques'];
  }
  return errors;
}

export const AdminList = (props) => (
    <List
      title="Admins"
      {...props}
    >
        <Datagrid>
          <TextField source="id" />
          <TextField source="email" label="Email" />
          {props.permissions === 'superAdmin' &&  <ReferenceField label="Ecole" source="schoolId" reference="schools">
            <TextField source="name" />
          </ReferenceField>}
          <EditButton />
        </Datagrid>
    </List>
);

const AdminTitle = ({ record }) => (<span>Admin {record ? `"${record.email}"` : ''}</span>);

export const AdminEdit = (props) => (
  <Edit title={<AdminTitle />} undoable={false} {...props}>
    <SimpleForm validate={validateEdit} redirect="list">
      <TextInput source="id" disabled />
      <TextInput source="email" label="Email" validate={required()} type='email' />
      {props.permissions === 'superAdmin' && <ReferenceInput label="Ecole" source="schoolId" reference="schools" validate={required()}>
        <SelectInput optionText="name" />
      </ReferenceInput>}
      <TextInput label="Mot de passe" source="password" type="password" />
      <TextInput label="Confirmation mot de passe" source="password2" type="password" />
    </SimpleForm>
  </Edit>
);

export const AdminCreate = (props) => (
  <Create {...props} undoable="false">
    <SimpleForm validate={validateEdit} redirect="list">
      <TextInput source="email" label="Email" validate={required()} type='email' />
      {props.permissions === 'superAdmin' &&  <ReferenceInput label="Ecole" source="schoolId" reference="schools" validate={required()} >
        <SelectInput optionText="name" />
      </ReferenceInput>}
      <TextInput label="Mot de passe" source="password" type="password" validate={required()} />
      <TextInput label="Confirmation mot de passe" source="password2" type="password" validate={required()} />
    </SimpleForm>
  </Create>
);
