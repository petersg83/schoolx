import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const DumbExportPage = (props) => {
  const textContent = props.isLoading ? <CircularProgress size={20} /> : 'Exporter';
  return <div style={{ marginTop: '20px', width: '600px' }}>
    <Typography varient="body">Exporter au format .xlsx toutes les données de l'application concernant votre école.</Typography>
    <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '10px 0px' }}>
      <Button disabled={props.isLoading} variant="contained" size="small"  color="secondary" onClick={props.onClickOnExportButton}>
        {textContent}
      </Button>
    </div>
  </div>;
};

export default DumbExportPage;
