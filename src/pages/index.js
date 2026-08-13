import React from 'react';

import Header from '../components/header';
import Nav from '../components/nav';
import BackToTop from '../components/back-to-top';
import FlyingAvatar from '../components/flying-avatar';
import ScrollIndicator from '../components/scroll-indicator';
import Reveal from '../components/reveal';
import Repos from '../components/repos';
import Codigofacilito from '../components/codigofacilito';
import Medium from '../components/medium';
import EdNav from '../components/education-nav';
import Skills from '../components/skills';
import Experience from '../components/experience';

export default () => (
  <div style={{ backgroundColor: '#0d0d14', minHeight: '100vh' }} className="pb-16">
    <a href="#main-content" className="skip-link">
      Saltar al contenido
    </a>
    <Nav />
    <Header />
    <main id="main-content">
      <Reveal>
        <EdNav />
      </Reveal>
      <Reveal delay={80}>
        <Skills />
      </Reveal>
      <Reveal delay={80}>
        <Experience />
      </Reveal>
      <Reveal delay={80}>
        <Repos />
      </Reveal>
      <Reveal delay={80}>
        <Codigofacilito />
      </Reveal>
      <Reveal delay={80}>
        <Medium />
      </Reveal>
    </main>
    <FlyingAvatar />
    <ScrollIndicator />
    <BackToTop />
  </div>
);
