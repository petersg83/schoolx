import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const SchoolList = (props) => (
    <List
      title="Toutes les écoles"
      {...props}
    >
        <Datagrid>
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="urlName" />
        </Datagrid>
    </List>
);

// <EmailField source="email" />
