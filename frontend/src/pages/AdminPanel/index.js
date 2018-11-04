import React from 'react';
import jsonServerProvider from 'ra-data-json-server';
import { Layout, Admin, Resource, fetchUtils, resolveBrowserLocale } from 'react-admin';
import { Route } from 'react-router-dom';
import { SchoolList, SchoolEdit, SchoolCreate } from './reactAdminComponents/schools';
import { MemberList, MemberEdit, MemberCreate, MemberShow } from './reactAdminComponents/members';
import { SchoolYearList, SchoolYearEdit, SchoolYearCreate, SchoolYearShow } from './reactAdminComponents/schoolYears';
import { AdminList, AdminEdit, AdminCreate } from './reactAdminComponents/admins';
import LoginPage from './reactAdminComponents/LoginPage';
import CalendarPage from './reactAdminComponents/CalendarPage';
import Dashboard from './reactAdminComponents/dashboard';
import authProvider from './reactAdminComponents/authProvider';
import frenchMessages from 'ra-language-french';
import englishMessages from 'ra-language-english';
import Menu from './menu'
import IntAndOutPage from './reactAdminComponents/InAndOutPage';

frenchMessages.ra.auth.username = 'email';

const messages = {
  fr: frenchMessages,
  en: englishMessages,
}
const i18nProvider = locale => messages[locale];

export const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const jwt = localStorage.getItem('jwt');
  options.headers.set('Authorization', `Bearer ${jwt}`);
  return fetchUtils.fetchJson(url, options);
}


const convertFileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

const addUploadFeature = requestHandler => (type, resource, params) => {
  if ((type === 'UPDATE' || type === 'CREATE') && resource === 'members') {
    console.log('data', params.data);
    if (params.data.pictures) {

      return convertFileToBase64(params.data.pictures)
        .then(picture64 => ({
          src: picture64,
          title: `${params.data.pictures.title}`,
        }))
        .then(transformedNewPicture => requestHandler(type, resource, {
          ...params,
          data: {
            ...params.data,
            pictures: transformedNewPicture,
          },
        }));
    }
  }
  // for other request types and resources, fall back to the default request handler
  return requestHandler(type, resource, params);
};

const dataProvider = jsonServerProvider('http://localhost:3000', httpClient);
const uploadCapableDataProvider = addUploadFeature(dataProvider);

const CustomRoutes = [
  <Route exact path="/calendar" options={{ label: 'Calendrier' }} component={CalendarPage} />,
  <Route exact path="/inandout" component={IntAndOutPage} noLayout />,
];

const getRessources = (role) => {
  if (role === 'admin') {
    return [
      <Resource options={{ label: 'Années' }} name="schoolYears" list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate} show={SchoolYearShow} />,
      <Resource options={{ label: 'Admins' }} name="admins" list={AdminList} edit={AdminEdit} create={AdminCreate} />,
      <Resource options={{ label: 'Membres' }} name="members" list={MemberList} edit={MemberEdit} create={MemberCreate} show={MemberShow} />,
      <Resource options={{ label: 'memberSettings' }} name="memberSettings" />,
      <Resource options={{ label: 'memberPeriodsAtSchool' }} name="memberPeriodsAtSchool" />,
    ];
  } else if (role === 'superAdmin') {
    return [
      <Resource options={{ label: 'Ecoles' }} name="schools" list={SchoolList} edit={SchoolEdit} create={SchoolCreate} />,
      <Resource options={{ label: 'Admins' }} name="admins" list={AdminList} edit={AdminEdit} create={AdminCreate} />,
      <Resource options={{ label: 'Membres' }} name="members" list={MemberList} edit={MemberEdit} create={MemberCreate} show={MemberShow} />,
      <Resource options={{ label: 'Années' }} name="schoolYears" list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate} show={SchoolYearShow} />,
      <Resource options={{ label: 'memberSettings' }} name="memberSettings" />,
      <Resource options={{ label: 'memberPeriodsAtSchool' }} name="memberPeriodsAtSchool" />,
    ];
  }
}

const MyLayout = props => <Layout {...props} menu={Menu} />;

const AdminPanel = props => (<Admin
  locale={resolveBrowserLocale()}
  i18nProvider={i18nProvider}
  dataProvider={uploadCapableDataProvider}
  dashboard={Dashboard}
  authProvider={authProvider}
  loginPage={LoginPage}
  customRoutes={CustomRoutes}
  appLayout={MyLayout}
>
  {getRessources}
</Admin>);

export default AdminPanel;
