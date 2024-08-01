import React from 'react';

const HamburgerMenu = ({ toggleMenu, menuOpen, closeMenu }) => {
  return (
    <>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={menuOpen ? "bar open" : "bar"}></div>
        <div className={menuOpen ? "bar open" : "bar"}></div>
        <div className={menuOpen ? "bar open" : "bar"}></div>
      </div>
      <div className={menuOpen ? "menu-backdrop open" : "menu-backdrop"} onClick={closeMenu}></div>
    </>
  );
};

export default HamburgerMenu;
