import React from 'react';
import { connect } from 'react-redux';
import { Responsive, MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';
import ViewListIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import TodayIcon from '@material-ui/icons/Today';
import DashboardIcon from '@material-ui/icons/Dashboard';

const MyMenu = (props) => {
  return (
    <div>
      {props.hasDashboard &&
        <MenuItemLink key="dashboard" to="/" primaryText="Dashboard" onClick={props.onMenuClick} leftIcon={<DashboardIcon />} />}
      {props.resources.filter(r => r.hasList).map(resource => (
        <MenuItemLink key={`${resource.name}`} to={`/${resource.name}`} primaryText={resource.options.label || resource.name} onClick={props.onMenuClick} leftIcon={<resource.icon /> || <ViewListIcon />} />
      ))}
      <MenuItemLink to="/calendar" primaryText="Calendrier" onClick={props.onMenuClick} leftIcon={<TodayIcon />} />
      <MenuItemLink to="/settings" primaryText="Paramètres" onClick={props.onMenuClick} leftIcon={<SettingsIcon />} />
      <Responsive
        small={props.logout}
        medium={null} // Pass null to render nothing on larger devices
      />
    </div>
  );
}

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(MyMenu));
