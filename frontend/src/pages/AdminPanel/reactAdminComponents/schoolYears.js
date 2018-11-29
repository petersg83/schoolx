import React from 'react';
import moment from 'moment-timezone';
import { ArrayField, ArrayInput, Create, Datagrid, DateInput, DateField, Edit, EditButton, FormTab, NumberField, NumberInput, List, required, SelectArrayInput, Show, ShowButton, SimpleForm, SimpleFormIterator, Tab, TabbedForm, TabbedShowLayout, TextField, TextInput } from 'react-admin';

const validateEdit = (values) => {
  const errors = {};
  if (moment(values.startAt).isSameOrAfter(moment(values.endAt))) {
    errors.endAt = ['La date de fin doit être après la date de début'];
  }
  return errors;
}

const daysChoices = [
  { id: 'monday', name: 'Lundi' },
  { id: 'tuesday', name: 'Mardi' },
  { id: 'wednesday', name: 'Mercredi' },
  { id: 'thursday', name: 'Jeudi' },
  { id: 'friday', name: 'Vendredi' },
  { id: 'saturday', name: 'Samedi' },
  { id: 'sunday', name: 'Dimanche' },
];

const daysMap = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

const getDateString = (date) => moment(date).format('DD/MM/YYYY');

const SchoolYearTitle = ({ record }) => (<span>Année {record ? `${getDateString(record.startAt)} → ${getDateString(record.endAt)}` : ''}</span>);

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
      <ShowButton />
    </Datagrid>
  </List>
);

const DaysField = ({ record }) => <span>{record.days.map(day => daysMap[day]).join(', ')}</span>;
const EndAtField = ({ record }) => <span>{record.endAt ? moment(record.endAt).format('DD/MM/YYYY') : 'à définir'}</span>;

export const SchoolYearShow = (props) => (
  <Show title={<SchoolYearTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Début/Fin">
        <DateField source="startAt" label="Du"/>
        <DateField source="endAt" label="Au" />
        <NumberField source="nbOfDaysOfHolidays" label="Nb de jours de vacances" />
      </Tab>
      <Tab label="Journées types">
        <ArrayField source="schoolYearSettings" label="Pour cette période" style={{ width: '100%' }}>
          <Datagrid>
            <DateField source="startAt" label="Du" />
            <EndAtField source="endAt" label="Jusqu'au" />
            <ArrayField source="usualOpenedDays" label="Journées types" style={{ width: '100%' }}>
              <Datagrid>
                <DaysField label="Jours ouverts" source="days" />
                <TextField source="openAt" label="De" />
                <TextField source="closeAt" label="À" />
                <TextField source="maxArrivalTime" label="Heure d'arrivée max" />
                <TextField source="minTimeBefTotalAbsence" label="Absence partielle en dessous de" />
                <TextField source="minTimeBefPartialAbsence" label="Absence totale en dessous de" />
              </Datagrid>
            </ArrayField>
          </Datagrid>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const SchoolYearEdit = (props) => (
  <Edit title={<SchoolYearTitle />} undoable={false} {...props}>
    <TabbedForm validate={validateEdit} redirect="show">
      <FormTab label="Début/Fin">
        <DateInput source="startAt" label="Du" validate={required()} />
        <DateInput source="endAt" label="Au" validate={required()} />
        <NumberInput source="nbOfDaysOfHolidays" label="Nb de jours de vacances" validate={required()} step={1} />
      </FormTab>
      <FormTab label="Journées types">
        <ArrayInput source="schoolYearSettings" label="Pour cette période" style={{ width: '100%' }}>
          <SimpleFormIterator>
            <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} validate={required()} />
            <DateInput source="endAt" label="Jusqu'au" />
            <ArrayInput source="usualOpenedDays" label="Journées types" style={{ width: '100%' }}>
              <SimpleFormIterator>
                <SelectArrayInput label="Jours ouverts" source="days" choices={daysChoices} validate={required()} />
                <TextInput source="openAt" label="De" validate={required()}  type="time" InputLabelProps={{ shrink: true }} />
                <TextInput source="closeAt" label="À" validate={required()}  type="time" InputLabelProps={{ shrink: true }} />
                <TextInput source="maxArrivalTime" label="Heure d'arrivée max" validate={required()}  type="time" InputLabelProps={{ shrink: true }} />
                <TextInput source="minTimeBefTotalAbsence" label="Abscence partielle en dessous de"  type="time" InputLabelProps={{ shrink: true }} />
                <TextInput source="minTimeBefPartialAbsence" label="Abscence totale en dessous de" validate={required()}  type="time" InputLabelProps={{ shrink: true }} />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);


// TODO: verifier que l'arrayusualOpenedDays n'est pas vide
export const SchoolYearCreate = (props) => (
  <Create title="Ajouter une nouvelle année"  {...props} undoable="false">
    <SimpleForm validate={validateEdit} redirect="list">
      <DateInput source="startAt" label="Du" validate={required()} />
      <DateInput source="endAt" label="Au" validate={required()} />
      <NumberInput source="nbOfDaysOfHolidays" label="Nb de jours de vacances" validate={required()} step={1}/>
      <ArrayInput source="schoolYearSettings" label="Paramètres des journées" style={{ width: '100%' }}>
        <SimpleFormIterator>
          <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} validate={required()} />
          <DateInput source="endAt" label="Jusqu'au" />
          <ArrayInput source="usualOpenedDays" label="Journées types" style={{ width: '100%' }}>
            <SimpleFormIterator>
              <SelectArrayInput label="Jours ouverts" source="days" choices={daysChoices} validate={required()} />
              <TextInput source="openAt" label="De" validate={required()} type="time"  InputLabelProps={{ shrink: true }} />
              <TextInput source="closeAt" label="À" validate={required()} type="time" InputLabelProps={{ shrink: true }} />
              <TextInput source="maxArrivalTime" label="Heure d'arrivée max" validate={required()} type="time" InputLabelProps={{ shrink: true }} />
              <TextInput source="minTimeBefTotalAbsence" label="Abscence partielle en dessous de" validate={required()} type="time" InputLabelProps={{ shrink: true }} />
              <TextInput source="minTimeBefPartialAbsence" label="Abscence totale en dessous de" validate={required()} type="time" InputLabelProps={{ shrink: true }} />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
