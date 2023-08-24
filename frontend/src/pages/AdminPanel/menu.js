import React from 'react';
import { Menu, useResourceDefinitions } from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import TodayIcon from '@mui/icons-material/Today';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const MyMenu = (props) => {
  const resources = useResourceDefinitions();

  return (
    <Menu {...props}>
      <Menu.DashboardItem />
      {Object.keys(resources).map(name => (
        <Menu.ResourceItem key={name} name={name} />
      ))}
      <Menu.Item to="/calendar" primaryText="Calendrier" leftIcon={<TodayIcon />} />
      <Menu.Item to="/statistics" primaryText="Statistiques" leftIcon={<ShowChartIcon />} />
      <Menu.Item to="/settings" primaryText="Paramètres" leftIcon={<SettingsIcon />} />
    </Menu>
  );
}

export default MyMenu;
