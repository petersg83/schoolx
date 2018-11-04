import React from 'react';
import moment from 'moment';
import { ArrayInput, Create, Datagrid, DateInput, DateField, Edit, EditButton, Filter, FormTab, ImageInput, ImageField, List, required, ReferenceField, ReferenceManyField, TextField, TextInput, SelectArrayInput, Show, ShowButton, SimpleForm, SimpleFormIterator, Tab, TabbedForm, TabbedShowLayout } from 'react-admin';
import { periodsOverlap } from '../../../utils/dates';
import config from '../../../config';

const validateDates = (value) => {
  if (periodsOverlap(value)) {
    return 'Les périodes ne doivent pas se superposer';
  }
}

const MemberTitle = ({ record }) => (<span>Membre {record ? `"${record.firstName} ${record.lastName}"` : ''}</span>);

const dayOffChoices = [
  { id: 'monday', name: 'Lundi' },
  { id: 'tuesday', name: 'Mardi' },
  { id: 'wednesday', name: 'Mercredi' },
  { id: 'thursday', name: 'Jeudi' },
  { id: 'friday', name: 'Vendredi' },
  { id: 'saturday', name: 'Samedi' },
  { id: 'sunday', name: 'Dimanche' },
];

const daysOffMap = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

const DaysOffField = ({ record }) => <span>{record.daysOff.map(day => daysOffMap[day]).join(', ')}</span>;
const EndAtField = ({ record }) => <span>{record.endAt ? moment(record.endAt).format('DD/MM/YYYY') : 'à définir'}</span>;
const AvatarField = ({ record, fileName }) => record[fileName] ? <img alt={record.firstName} style={{ marginTop: '20px', maxWidth: '100px', maxHeight: '150px' }} src={`${config.apiEndpoint}/public/avatars/${record[fileName]}`} /> : null;
const TinyAvatarField = ({ record, fileName }) => record[fileName] ? <img alt={record.firstName} style={{ maxWidth: '24px', maxHeight: '32px' }} src={`${config.apiEndpoint}/public/avatars/${record[fileName]}`} /> : null;

const MemberFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

export const MemberList = (props) => (
  <List
    title="Membres"
    filters={<MemberFilter />}
    {...props}
  >
    <Datagrid>
      <TinyAvatarField fileName="avatarPath" label="Avatar" />
      <TextField source="firstName" label="Prénom"/>
      <TextField source="lastName" label="Nom" />
      <DateField source="birthday" label="Date de naissance" />
      {props.permissions === 'superAdmin' &&  <ReferenceField label="Ecole" source="schoolId" reference="schools">
        <TextField source="urlName" />
      </ReferenceField>}
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const MemberShow = (props) => (
  <Show title={<MemberTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="Résumé">
        <AvatarField fileName="avatarPath"/>
        <TextField source="firstName" label="Prénom" />
        <TextField source="lastName" label="Nom" type="url" />
        <DateField source="birthday" label="Date de naissance" />
      </Tab>
      <Tab label="Jour off">
        <ReferenceManyField reference="memberSettings" target="memberId" addLabel={false}>
          <Datagrid>
            <DaysOffField source="daysOff" label="Jours off" />
            <DateField source="startAt" label="Du" />
            <EndAtField source="endAt" label="Jusqu'au" />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
      <Tab label="Périodes d'inscription">
        <ReferenceManyField reference="memberPeriodsAtSchool" target="memberId" addLabel={false}>
          <Datagrid>
            <DateField source="startAt" label="Du" />
            <EndAtField source="endAt" label="Jusqu'au" />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const MemberEdit = (props) => (
  <Edit title={<MemberTitle />} undoable={false} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Résumé">
        <AvatarField fileName="avatarPath"/>
        <ImageInput source="pictures" label="Avatar" accept="image/*" multiple={false} options={{ style: { width: '224px' } }} onDrop={(accepted, rejected) => console.log('mm', rejected)} placeholder={<p>Faites glisser le nouvel avatar ici<br />3Mo max</p>}>
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="firstName" label="Prénom" validate={required()} />
        <TextInput source="lastName" label="Nom" type="url" validate={required()} />
        <DateInput source="birthday" label="Date de naissance" validate={required()} />
      </FormTab>
      <FormTab label="Jours off">
        <ArrayInput source="memberSettings" label="Périodes de jours off" style={{ width: '100%' }} validate={validateDates}>
          <SimpleFormIterator>
            <SelectArrayInput label="Jours off" source="daysOff" choices={dayOffChoices} validate={required()} />
            <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} options={{ format: 'DD/MM/YYYY' }} validate={required()} />
            <DateInput source="endAt" label="Jusqu'au" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Périodes d'inscription">
        <ArrayInput source="memberPeriodsAtSchool" label="Périodes où le membre est inscrit à l'école" style={{ width: '100%' }} validate={validateDates}>
          <SimpleFormIterator>
            <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} options={{ format: 'DD/MM/YYYY' }} validate={required()} />
            <DateInput source="endAt" label="Jusqu'au" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export const MemberCreate = (props) => (
  <Create {...props} title="Ajouter un membre à l'école" undoable="false">
    <SimpleForm redirect="show">
      <ImageInput source="pictures" label="Avatar" accept="image/*" multiple={false} options={{ style: { width: '224px' } }} onDrop={(accepted, rejected) => console.log('mm', rejected)} placeholder={<p>Faites glisser le nouvel avatar ici<br />3Mo max</p>}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="firstName" label="Prénom" validate={required()} />
      <TextInput source="lastName" label="Nom" type="url" validate={required()} />
      <DateInput source="birthday" label="Date de naissance" validate={required()} />
      <DateInput source="arrivalDate" label="Date d'arrivée" />
      <SelectArrayInput label="Jours off" source="daysOff" choices={dayOffChoices} />
    </SimpleForm>
  </Create>
);
