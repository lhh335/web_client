import React from 'react';
import Title from 'react-title-component';

 

const AppBarPage = () => (
  <div>
    <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />


  </div>
);

export default AppBarPage;