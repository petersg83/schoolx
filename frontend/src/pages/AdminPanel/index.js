import React from 'react';
import jsonServerProvider from 'ra-data-json-server';
import { Admin, Resource, fetchUtils, resolveBrowserLocale } from 'react-admin';
import { SchoolList, SchoolEdit, SchoolCreate } from './reactAdminComponents/schools';
import { MemberList, MemberEdit, MemberCreate, MemberShow } from './reactAdminComponents/members';
import { SchoolYearList, SchoolYearEdit, SchoolYearCreate } from './reactAdminComponents/schoolYears';
import { AdminList, AdminEdit, AdminCreate } from './reactAdminComponents/admins';
import LoginPage from './reactAdminComponents/LoginPage';
import Dashboard from './reactAdminComponents/dashboard';
import authProvider from './reactAdminComponents/authProvider';
import frenchMessages from 'ra-language-french';
import englishMessages from 'ra-language-english';

frenchMessages.ra.auth.username = 'email';

const messages = {
  fr: frenchMessages,
  en: englishMessages,
}
const i18nProvider = locale => messages[locale];

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const jwt = localStorage.getItem('jwt');
  options.headers.set('Authorization', `Bearer ${jwt}`);
  return fetchUtils.fetchJson(url, options);
}

const dataProvider = jsonServerProvider('http://localhost:3000', httpClient);

const getRessources = (role) => {
  if (role === 'admin') {
    return [
      <Resource options={{ label: 'Années' }} name="schoolYears" list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate}/>,
      <Resource options={{ label: 'Admins' }} name="admins" list={AdminList} edit={AdminEdit} create={AdminCreate}/>,
      <Resource options={{ label: 'Membres' }} name="members" list={MemberList} edit={MemberEdit} create={MemberCreate} show={MemberShow} />,
      <Resource options={{ label: 'memberSettings' }} name="memberSettings" />,
      <Resource options={{ label: 'memberPeriodsAtSchool' }} name="memberPeriodsAtSchool" />,
    ];
  } else if (role === 'superAdmin') {
    return [
      <Resource options={{ label: 'Ecoles' }} name="schools" list={SchoolList} edit={SchoolEdit} create={SchoolCreate} />,
      <Resource options={{ label: 'Admins' }} name="admins" list={AdminList} edit={AdminEdit} create={AdminCreate}/>,
      <Resource options={{ label: 'Membres' }} name="members" list={MemberList} edit={MemberEdit} create={MemberCreate} show={MemberShow} />,
      <Resource options={{ label: 'Années' }} name="schoolYears" list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate}/>,
      <Resource options={{ label: 'memberSettings' }} name="memberSettings" />,
      <Resource options={{ label: 'memberPeriodsAtSchool' }} name="memberPeriodsAtSchool" />,
    ];
  }
}

const AdminPanel = props => (<Admin
  locale={resolveBrowserLocale()}
  i18nProvider={i18nProvider}
  dataProvider={dataProvider}
  dashboard={Dashboard}
  authProvider={authProvider}
  loginPage={LoginPage}
>
  {getRessources}
</Admin>);

export default AdminPanel;
