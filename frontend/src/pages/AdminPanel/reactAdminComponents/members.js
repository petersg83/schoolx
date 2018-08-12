import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const MemberList = (props) => (
    <List
      title="Toutes les membres"
      {...props}
    >
        <Datagrid>
          <TextField source="id" />
          <TextField source="firstName" />
          <TextField source="lastName" />
        </Datagrid>
    </List>
);
