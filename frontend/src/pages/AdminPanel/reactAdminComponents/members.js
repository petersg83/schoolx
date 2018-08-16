import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const MemberList = (props) => (
    <List
      title="Membres"
      {...props}
    >
        <Datagrid>
          <TextField source="id" />
          <TextField source="firstName" label="Prénom" />
          <TextField source="lastName" label="Nom" />
        </Datagrid>
    </List>
);
