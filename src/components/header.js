import React from 'react';
import illustration from '../imgs/webpages.svg';
import Form from './contact.form';

export default () => (
  <header
    className="bg-gray-300"
    style={{
      backgroundImage:
        'url(' +
        'https://instagram.fbog6-1.fna.fbcdn.net/v/t51.2885-15/e35/96723088_713095639463259_2842292796452057265_n.jpg?_nc_ht=instagram.fbog6-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=HM9rWzX12yYAX-IxuCI&oh=bd29890d55666b782797eac9a91d2538&oe=5F839024' +
        ')',
      'background-size': 'cover',
    }}
  >
    <div className="container mx-auto p-12 max-w-4xl ">
      <div className="flex justify-center items-center">
        <div className="flex-1">
          <h1 className="font-bold text-purple-700 text-6xl">Macorreag</h1>
          <p>Web apps</p>
        </div>
        <img
          src={illustration}
          alt="Persona al lado de una pagina web"
          className="h-48 min-h-10 max-h-20 hidden sm:block"
        ></img>
      </div>
      <div>
        <Form></Form>
      </div>
    </div>
  </header>
);
