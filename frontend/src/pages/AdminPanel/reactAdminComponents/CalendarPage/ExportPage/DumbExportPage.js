import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const DumbExportPage = (props) => {
  return <div style={{ marginTop: '20px', width: '600px' }}>
    <Typography varient="body">Exporter au format .csv toutes les données de l'application concernant votre école.</Typography>
    <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '10px 0px' }}>
      <Button variant="contained" size="small"  color="secondary" onClick={props.onClickOnExportButton}>
        Exporter
      </Button>
    </div>
  </div>;
};

export default DumbExportPage;
