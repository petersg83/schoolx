import React from 'react';
import jsonServerProvider from 'ra-data-json-server';
import { CustomRoutes, Layout, Admin, Resource, fetchUtils, resolveBrowserLocale, withLifecycleCallbacks } from 'react-admin';
import { Route } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { castArray } from 'lodash';
import { SchoolList, SchoolEdit, SchoolCreate } from './reactAdminComponents/schools';
import { MemberList, MemberEdit, MemberCreate, MemberShow } from './reactAdminComponents/members';
import { SchoolYearList, SchoolYearEdit, SchoolYearCreate, SchoolYearShow } from './reactAdminComponents/schoolYears';
import { AdminList, AdminEdit, AdminCreate } from './reactAdminComponents/admins';
import LoginPage from './reactAdminComponents/LoginPage';
import StatisticsPage from './reactAdminComponents/StatisticsPage';
import CalendarPage from './reactAdminComponents/CalendarPage';
import Dashboard from './reactAdminComponents/dashboard';
import authProvider from './reactAdminComponents/authProvider';
import frenchMessages from 'ra-language-french';
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import Menu from './menu'
import InAndOutPage from './reactAdminComponents/InAndOutPage';
import SettingsPage from './reactAdminComponents/SettingsPage';

import config from '../../config';

frenchMessages.ra.auth.username = 'email';

const messages = {
  fr: frenchMessages,
  en: englishMessages,
}
const i18nProvider = polyglotI18nProvider(locale => messages[locale]);

export const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({
      Accept: 'application/json',
      "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
    });
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

const convertPictureToBase64 = async (params) => {
  if (!params.data.pictures) {
    return params;
  }
  
  const newPictures = castArray(params.data.pictures).filter(p => p.rawFile instanceof File);
  const formerPictures = castArray(params.data.pictures).filter(p => !(p.rawFile instanceof File));

  const base64Pictures = await Promise.all(newPictures.map(convertFileToBase64))
    .then(base64Pictures =>
      base64Pictures.map(picture64 => ({
        src: picture64,
        title: `${params.data.pictures.title}`,
      }))
  );
  
  return {
    ...params,
    data: {
      ...params.data,
      pictures: [
        ...base64Pictures,
        ...formerPictures,
      ],
    },
  }
}

const dataProvider = jsonServerProvider(config.apiEndpoint, httpClient);
const uploadCapableDataProvider = withLifecycleCallbacks(dataProvider, [
  {
    resource: 'members',
    beforeCreate: convertPictureToBase64,
    beforeUpdate: convertPictureToBase64,
    beforeUpdateMany: convertPictureToBase64,
  }
]);

const getResources = (role) => {
  if (role === 'admin') {
    return <>
      <Resource options={{ label: 'Années' }} name="schoolYears" icon={DateRangeIcon} list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate} show={SchoolYearShow} />
      <Resource options={{ label: 'Admins' }} name="admins" icon={PermIdentityIcon} list={AdminList} edit={AdminEdit} create={AdminCreate} />
      <Resource options={{ label: 'Membres' }} name="members" icon={PeopleIcon} list={MemberList} edit={MemberEdit} create={MemberCreate} show={MemberShow} />
      {/* <Resource options={{ label: 'memberSettings' }} name="memberSettings" />
      <Resource options={{ label: 'memberPeriodsAtSchool' }} name="memberPeriodsAtSchool" /> */}
      <CustomRoutes>
        <Route exact path="/calendar" element={<CalendarPage />} options={{ label: 'Calendrier' }} />
        <Route exact path="/statistics" element={<StatisticsPage />} options={{ label: 'Statistiques' }} />
        <Route exact path="/settings" element={<SettingsPage />} options={{ label: 'Paramètres' }} />
      </CustomRoutes>
    </>;
  } else if (role === 'superAdmin') {
    return <>
      <Resource options={{ label: 'Ecoles' }} name="schools" icon={DateRangeIcon} list={SchoolList} edit={SchoolEdit} create={SchoolCreate} />
      <Resource options={{ label: 'Admins' }} name="admins" icon={PermIdentityIcon} list={AdminList} edit={AdminEdit} create={AdminCreate} />
      <Resource options={{ label: 'Membres' }} name="members" icon={PeopleIcon} list={MemberList} edit={MemberEdit} create={MemberCreate} show={MemberShow} />
      <Resource options={{ label: 'Années' }} name="schoolYears" list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate} show={SchoolYearShow} />
      <Resource options={{ label: 'memberSettings' }} name="memberSettings" />
      <Resource options={{ label: 'memberPeriodsAtSchool' }} name="memberPeriodsAtSchool" />
    </>;
  } else if (role === 'inandout') { // Needed to access inandout page when unauthenticated. Waiting for enhancement : https://github.com/marmelab/react-admin/issues/1647
    return <>
      <CustomRoutes noLayout>
        <Route exact path="/inandout" element={<InAndOutPage />} />
      </CustomRoutes>
      <Resource options={{ label: 'Années' }} name="schoolYears" icon={DateRangeIcon} list={SchoolYearList} edit={SchoolYearEdit} create={SchoolYearCreate} show={SchoolYearShow} />
    </>;
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
  layout={MyLayout}
>
  {getResources}
</Admin>);

export default AdminPanel;
