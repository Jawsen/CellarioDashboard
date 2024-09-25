import React from 'react';
import { ReactComponent as Logo } from '../icons/logo.svg';

function Header() {
  return (
    <header className=" w-[16] h-16" style={{ backgroundColor: '#326AA0' }}>
      {/* Bruger det importerede SVG-logo */}
      <div className="flex items-center">
        <Logo className="h-8 w-8 text-white" />
        <div className="ml-6 font-roboto font-bold text-white text-3xl">
        LAB-HUB
        </div>
      </div>
    </header>
  );
}

export default Header;