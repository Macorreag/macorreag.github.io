import React from 'react';

import Header from '../components/header';
import Repos from '../components/repos';
import Codigofacilito from '../components/codigofacilito';
import Medium from '../components/medium';
import EdNav from '../components/education-nav';
import Skills from '../components/skills';
import Experience from '../components/experience';
import Seo from '../components/seo';


export default () => (
  <div style={{ backgroundColor: '#0d0d14', minHeight: '100vh' }} className="pb-16">
    <Seo
      title="Miller Correa | Portafolio"
      description="Portafolio técnico de Miller Correa con experiencia, skills, repositorios y artículos."
    />
    <Header></Header>
    <EdNav></EdNav>
    <Skills></Skills>
    <Experience></Experience>
    <Repos></Repos>
    <Codigofacilito />
    <Medium></Medium>
  </div>
);
