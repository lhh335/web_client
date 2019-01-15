import React from 'react';
import Title from 'react-title-component';

 

const AppBarPage = () => (
  <div>
    <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />
    <div>
        this is a admin
    </div>

  </div>
);

export default AppBarPage;