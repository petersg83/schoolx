import React from 'react';
import { Menu, usePermissions, useResourceDefinitions } from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import TodayIcon from '@mui/icons-material/Today';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const MyMenu = (props) => {
  const resources = useResourceDefinitions();
  const { permissions } = usePermissions();
  const isSchoolAdmin = permissions === 'admin';

  return (
    <Menu {...props}>
      <Menu.DashboardItem />
      {Object.keys(resources).filter(name => resources[name].hasList).map(name => (
        <Menu.ResourceItem key={name} name={name} />
      ))}
      {/* Ces pages n'existent que pour les admins d'une école (cf. index.js) */}
      {isSchoolAdmin && <Menu.Item to="/calendar" primaryText="Calendrier" leftIcon={<TodayIcon />} />}
      {isSchoolAdmin && <Menu.Item to="/statistics" primaryText="Statistiques" leftIcon={<ShowChartIcon />} />}
      {isSchoolAdmin && <Menu.Item to="/settings" primaryText="Paramètres" leftIcon={<SettingsIcon />} />}
    </Menu>
  );
}

export default MyMenu;
