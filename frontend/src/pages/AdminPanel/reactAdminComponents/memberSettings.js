import React from 'react';
import moment from 'moment';
import { ArrayInput, Create, Datagrid, DateInput, DateField, DisabledInput, Edit, EditButton, List, required, ReferenceField, TextField, TextInput, SelectInput, Show, ShowButton, SimpleForm, SimpleFormIterator, Tab, TabbedShowLayout } from 'react-admin';

// const validateMemberEdit = (values) => {
//   const errors = {};
//   // if (!values.firstName) {
//   //     errors.firstName = ['Le prénom est obligatoire'];
//   // }
//   // if (!values.lastName) {
//   //     errors.lastName = ['Le nom est obligatoire'];
//   // }
//   // if (!values.birthday || !moment(values.birthday).isValid()) {
//   //     errors.birthday = ['La date de naissance est obligatoire'];
//   // }
//   return errors
// };

// const MemberSettingsTitle = ({ record }) => (<span>Membre {record ? `"${record.firstName} ${record.lastName}"` : ''}</span>);
//
// const dayOffChoices = [
//   { id: 'none', name: 'Aucun' },
//   { id: 'monday', name: 'Lundi' },
//   { id: 'tuesday', name: 'Mardi' },
//   { id: 'wednesday', name: 'Mercredi' },
//   { id: 'thursday', name: 'Jeudi' },
//   { id: 'friday', name: 'Vendredi' },
//   { id: 'saturday', name: 'Samedi' },
//   { id: 'sunday', name: 'Dimanche' },
// ];
// {props.permissions === 'superAdmin' && <DisabledInput source="id" label="Id" />}
// export const MemberSettingsEdit = (props) => (
//   <Edit {...props}>
//     <SimpleForm>
//       <SelectInput defaultValue="none" label="Jour off" source="daysOff" choices={dayOffChoices} validate={required()} />
//       <DateInput source="startAt" label="Du" validate={required()} />
//       <DateInput source="endAt" label="Jusqu'au" validate={required()} />
//     </SimpleForm>
//   </Edit>
// );

// <ArrayInput source="memberSettings" label="Périodes de jours off">
//   <SimpleFormIterator>
//     <SelectInput defaultValue="none" label="Jour off" source="daysOff" choices={dayOffChoices} />
//     <DateInput source="startAt" />
//     <DateInput source="endAt" label="Jusqu'au" />
//   </SimpleFormIterator>
// </ArrayInput>
