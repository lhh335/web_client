import React from 'react';
import Title from 'react-title-component';

// import config from 'config.json';
 

const AppBarPage = () => (
  <div>
    <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />
    server: {config.server_version}

  </div>
);

export default AppBarPage;