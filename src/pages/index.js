import React from 'react';
import Header from '../components/header';
import Repos from '../components/repos';
import Codigofacilito from '../components/codigofacilito';
import Medium from '../components/medium';
import EdNav from '../components/education-nav';

export default () => (
  <div>
    <Header></Header>
    <EdNav></EdNav>
    <Repos></Repos>
    <Codigofacilito />
    <Medium></Medium>
  </div>
);
