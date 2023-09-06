import React from 'react';
import moment from 'moment';
import {
  ArrayInput,
  Create,
  Datagrid,
  DateInput,
  DateField,
  Edit,
  EditButton,
  EmailField,
  Filter,
  ImageInput,
  ImageField,
  List,
  required,
  ReferenceField,
  ReferenceManyField,
  TextField,
  TextInput,
  SelectArrayInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleFormIterator,
  Tab,
  TabbedForm,
  TabbedShowLayout,
  WithRecord
} from 'react-admin';
import { periodsOverlap } from '../../../utils/dates';
import { emailRegex, phoneNumberRegex } from '../../../utils/regex';
import config from '../../../config';

const validateDates = (value) => {
  if (periodsOverlap(value)) {
    return 'Les périodes ne doivent pas se superposer';
  }
}

const validatePhoneNumberFormat = (value) => {
  if (typeof value === 'string' && value.length && !value.match(phoneNumberRegex)) {
    return 'Format incorrect';
  }
}

const validateEmailFormat = (value) => {
  if (typeof value === 'string' && value.length && !value.match(emailRegex)) {
    return 'Format incorrect';
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

const DaysOffField = ({ label, source }) => <WithRecord label={label} render={(record) => <span>{record[source].map(day => daysOffMap[day]).join(', ')}</span>} />
const EndAtField = ({ label, source }) => <WithRecord label={label} render={(record) => <span>{record[source] ? moment(record.endAt).format('DD/MM/YYYY') : 'à définir'}</span>} />
const AvatarField = ({ label, source }) => <WithRecord label={label} render={(record) => record[source] ? <img alt={record.firstName} style={{ marginTop: '20px', maxWidth: '127px', maxHeight: '150px' }} src={`${config.apiEndpoint}/public/avatars/${record[source]}`} /> : <span></span>} />
const TinyAvatarField = ({ label, source }) => <WithRecord label={label} render={record => record[source] ? <img alt={record.firstName} style={{ maxWidth: '34px', maxHeight: '40px' }} src={`${config.apiEndpoint}/public/avatars/${record[source]}`} /> : <span></span>} />

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
      <TinyAvatarField source="avatarPath" label="Avatar" />
      <TextField source="pseudo" label="Pseudo"/>
      <TextField source="firstName" label="Prénom"/>
      <TextField source="lastName" label="Nom" />
      <DateField source="birthday" label="Date de naissance" locales="fr-FR" />
      <TextField source="phoneNumber" label="Numéro de téléphone" />
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
        <AvatarField source="avatarPath"/>
        <TextField source="pseudo" label="Pseudo"/>
        <TextField source="firstName" label="Prénom" />
        <TextField source="lastName" label="Nom" />
        <DateField source="birthday" label="Date de naissance" />
        <TextField source="phoneNumber" label="Numéro de téléphone" />
        <EmailField source="email" label="Email" />
        <TextField source="responsible1Name" label="Nom représentant·e légal·e 1" />
        <TextField source="responsible1Email" label="Email représentant·e légal·e 1" type="email" />
        <TextField source="responsible1PhoneNumber" label="Téléphone représentant·e légal·e 1" />
        <TextField source="responsible2Name" label="Nom représentant·e légal·e 2" />
        <TextField source="responsible2Email" label="Email représentant·e légal·e 2" type="email" />
        <TextField source="responsible2PhoneNumber" label="Téléphone représentant·e légal·e 2" />
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
  <Edit title={<MemberTitle />}>
    <TabbedForm redirect="show">
      <TabbedForm.Tab label="Résumé">
        <AvatarField source="avatarPath"/>
        <ImageInput source="pictures" label="Avatar" accept="image/*" multiple={false} sx={{ width: '224px' } } placeholder={<p>Faites glisser le nouvel avatar ici<br />5Mo max</p>}>
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="pseudo" label="Pseudo" />
        <TextInput source="firstName" label="Prénom" validate={required()} />
        <TextInput source="lastName" label="Nom" validate={required()} />
        <DateInput source="birthday" label="Date de naissance" validate={required()} />
        <TextInput source="phoneNumber" label="N° de téléphone" validate={validatePhoneNumberFormat} />
        <TextInput source="email" label="Email" type="email" />
        <TextInput source="responsible1Name" label="Nom représentant·e légal·e 1" />
        <TextInput source="responsible1Email" label="Email représentant·e légal·e 1" type="email" validate={validateEmailFormat} />
        <TextInput source="responsible1PhoneNumber" label="N° de tel représentant·e légal·e 1"  validate={validatePhoneNumberFormat} />
        <TextInput source="responsible2Name" label="Nom représentant·e légal·e 2" />
        <TextInput source="responsible2Email" label="Email représentant·e légal·e 2" type="email" validate={validateEmailFormat} />
        <TextInput source="responsible2PhoneNumber" label="N° de tel représentant·e légal·e 2"  validate={validatePhoneNumberFormat} />
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Jours off">
        <ArrayInput source="memberSettings" label="Périodes de jours off" style={{ width: '100%' }} validate={validateDates}>
          <SimpleFormIterator>
            <SelectArrayInput label="Jours off" source="daysOff" choices={dayOffChoices} validate={required()} />
            <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} options={{ format: 'DD/MM/YYYY' }} validate={required()} />
            <DateInput source="endAt" label="Jusqu'au" />
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Périodes d'inscription">
        <ArrayInput source="memberPeriodsAtSchool" label="Périodes où le membre est inscrit à l'école" style={{ width: '100%' }} validate={validateDates}>
          <SimpleFormIterator>
            <DateInput source="startAt" label="Du" value={moment().format('YYYY-MM-DD')} options={{ format: 'DD/MM/YYYY' }} validate={required()} />
            <DateInput source="endAt" label="Jusqu'au" />
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
    </TabbedForm>
  </Edit>
);

export const MemberCreate = (props) => (
  <Create {...props} title="Ajouter un membre à l'école" undoable="false">
    <SimpleForm redirect="show">
      <ImageInput source="pictures" label="Avatar" accept="image/*" multiple={false} sx={{ width: '224px' } } placeholder={<p>Faites glisser le nouvel avatar ici<br />5Mo max</p>}>
        <ImageField source="src" title="title" />
      </ImageInput>
      <TextInput source="pseudo" label="Pseudo" />
      <TextInput source="firstName" label="Prénom" validate={required()} />
      <TextInput source="lastName" label="Nom" validate={required()} />
      <DateInput source="birthday" label="Date de naissance" validate={required()} />
      <TextInput source="phoneNumber" label="N° de téléphone" validate={validatePhoneNumberFormat} />
      <TextInput source="email" label="Email" type="email" />
      <TextInput source="responsible1Name" label="Nom représentant·e légal·e 1" />
      <TextInput source="responsible1Email" label="Email représentant·e légal·e 1" type="email" validate={validateEmailFormat} />
      <TextInput source="responsible1PhoneNumber" label="N° de tel représentant·e légal·e 1"  validate={validatePhoneNumberFormat} />
      <TextInput source="responsible2Name" label="Nom représentant·e légal·e 2" />
      <TextInput source="responsible2Email" label="Email représentant·e légal·e 2" type="email" validate={validateEmailFormat} />
      <TextInput source="responsible2PhoneNumber" label="N° de tel représentant·e légal·e 2"  validate={validatePhoneNumberFormat} />
      <DateInput source="arrivalDate" label="Date d'arrivée" />
      <SelectArrayInput label="Jours off" source="daysOff" choices={dayOffChoices} />
    </SimpleForm>
  </Create>
);
