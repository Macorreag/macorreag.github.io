import React from 'react';

export default () => (
  <form className="mt-4">
    <label
      htmlFor="contact-content"
      className="block text-white/40 text-xs font-mono mb-2 uppercase tracking-widest"
    >
      <span className="text-primary">{'> '}</span>
      Cuentame la idea que planes hacer realidad:
    </label>
    <div
      className="flex border border-white/10 bg-black/40 overflow-hidden"
      style={{ boxShadow: '0 0 10px rgba(0,245,255,0.05)' }}
    >
      <textarea
        id="contact-content"
        className="flex-1 py-2 px-3 bg-transparent text-white/80 text-sm font-mono focus:outline-none placeholder:text-white/20 resize-none"
        name="contact-content"
        rows={3}
        placeholder="_"
      ></textarea>
      <button className="bg-primary/10 border-l border-white/10 text-primary text-xs font-mono font-bold px-4 uppercase tracking-widest hover:bg-primary/20 transition-colors whitespace-nowrap">
        Enviar_
      </button>
    </div>
  </form>
);
