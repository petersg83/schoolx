import React from 'react';
import moment from 'moment';
import { Create, Datagrid, DateInput, DateField, Edit, EditButton, NumberField, NumberInput, List, required, SimpleForm } from 'react-admin';

const validateEdit = (values) => {
  const errors = {};
  if (moment(values.startAt).isSameOrAfter(moment(values.endAt))) {
    errors.endAt = ['La date de fin doit être après la date de début'];
  }
  return errors;
}

const getDateString = (date) => moment(date).format('DD/MM/YYYY');

const SchoolYearTitle = ({ record }) => (<span>Année {record ? `${getDateString(record.startAt)} -> ${getDateString(record.endAt)}` : ''}</span>);

export const SchoolYearList = (props) => (
  <List
    title="Années"
    {...props}
  >
    <Datagrid>
      <DateField source="startAt" label="Du"/>
      <DateField source="endAt" label="Au" />
      <NumberField source="nbOfDaysOfHolidays" label="Nb de jours de vacances" />
      <EditButton />
    </Datagrid>
  </List>
);

export const SchoolYearEdit = (props) => (
  <Edit title={<SchoolYearTitle />} undoable={false} {...props}>
    <SimpleForm validate={validateEdit} redirect="list">
      <DateInput source="startAt" label="Du" validate={required()} />
      <DateInput source="endAt" label="Au" validate={required()} />
      <NumberInput source="nbOfDaysOfHolidays" label="Nb de jours de vacances" validate={required()} step={1}/>
    </SimpleForm>
  </Edit>
);

export const SchoolYearCreate = (props) => (
  <Create {...props} undoable="false">
    <SimpleForm validate={validateEdit} redirect="list">
      <DateInput source="startAt" label="Du" validate={required()} />
      <DateInput source="endAt" label="Au" validate={required()} />
      <NumberInput source="nbOfDaysOfHolidays" label="Nb de jours de vacances" validate={required()} step={1}/>
    </SimpleForm>
  </Create>
);
