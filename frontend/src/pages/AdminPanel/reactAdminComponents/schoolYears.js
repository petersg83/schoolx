import React from 'react';
import moment from 'moment-timezone';
import { ArrayField, ArrayInput, Create, Datagrid, DateInput, DateField, Edit, EditButton, FormTab, NumberField, NumberInput, List, required, SelectArrayInput, Show, ShowButton, SimpleForm, SimpleFormIterator, Tab, TabbedForm, TabbedShowLayout, TextField, TextInput, WithRecord } from 'react-admin';

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
  monday: 'lundi',
  tuesday: 'mardi',
  wednesday: 'mercredi',
  thursday: 'jeudi',
  friday: 'vendredi',
  saturday: 'samedi',
  sunday: 'dimanche',
};

const daysValueMap = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const sortArrayOfDaysName = (a, b) => daysValueMap[a] > daysValueMap[b] ? 1 : -1;

const getDateString = (date) => moment(date).format('DD/MM/YYYY');

const SchoolYearTitle = ({ label }) => <WithRecord label={label} render={(record) => <span>Année {`${getDateString(record.startAt)} → ${getDateString(record.endAt)}`}</span>} />;

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

const DaysField = ({ label, source }) => <WithRecord label={label} render={(record) => <span>{record[source].sort(sortArrayOfDaysName).map(day => daysMap[day]).join(', ')}</span>} />;
const EndAtField = ({ label, source }) => <WithRecord label={label} render={(record) => <span>{record[source] ? moment(record[source]).format('DD/MM/YYYY') : 'à définir'}</span>} />;

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
                <TextField source="minTimeBefPartialAbsence" label="Absence partielle en dessous de" />
                <TextField source="minTimeBefTotalAbsence" label="Absence totale en dessous de" />
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
                <TextInput source="openAt" label="De" validate={required()}  type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
                <TextInput source="closeAt" label="À" validate={required()}  type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
                <TextInput source="maxArrivalTime" label="Heure d'arrivée max" validate={required()}  type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
                <TextInput source="minTimeBefPartialAbsence" label="Abscence partielle en dessous de"  type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
                <TextInput source="minTimeBefTotalAbsence" label="Abscence totale en dessous de" validate={required()}  type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
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
      <ArrayInput source="schoolYearSettings" label="Paramètres des journées" validate={required()}  sx={{ width: '100%' }}>
        <SimpleFormIterator>
          <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} validate={required()} />
          <DateInput source="endAt" label="Jusqu'au" />
          <ArrayInput source="usualOpenedDays" label="Journées types" validate={required()} sx={{ width: '100%' }}>
            <SimpleFormIterator>
              <SelectArrayInput label="Jours ouverts" source="days" choices={daysChoices} validate={required()} />
              <TextInput source="openAt" label="De" validate={required()} type="time"  InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
              <TextInput source="closeAt" label="À" validate={required()} type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
              <TextInput source="maxArrivalTime" label="Heure d'arrivée max" validate={required()} type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
              <TextInput source="minTimeBefPartialAbsence" label="Abscence partielle en dessous de" validate={required()} type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
              <TextInput source="minTimeBefTotalAbsence" label="Abscence totale en dessous de" validate={required()} type="time" InputLabelProps={{ shrink: true }} sx={{ width: '100%' }} />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
