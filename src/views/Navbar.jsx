/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../logo.png';
import Search from './Search';

class Navbar extends Component {
  logout = () => {
    localStorage.clear();
    const { router } = this.props;
    router.replace('/');
  }

  render() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginPath = window.location.pathname === '/login';
    const signupPath = window.location.pathname === '/signup';
    return (
      <nav className='navbar navbar-expand-lg navbar navbar-dark bg-dark'>
        <Link className='navbar-brand' to='/'><img src={Logo} alt='Logo' /></Link>
        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item active'><NavLink className='nav-link' to='#'>About</NavLink></li>
            <li className='nav-item dropdown'>
              <NavLink className='nav-link dropdown-toggle' to='#' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Categories</NavLink>
            </li>
          </ul>
          <Search />
          <ul className='nav navbar-nav navbar-right'>
            {isLoggedIn === 'true'
              && !loginPath
              && (
                <li className='nav-item dropdown'>
                  <NavLink className='nav-link dropdown-toggle' to='#' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    { localStorage.getItem('email') }
                  </NavLink>
                  <div className='dropdown-menu' aria-labelledby='navbarDropdown' id='drop-menu'>
                    <Link className='dropdown-item' to='/profile'>Profile</Link>
                    <div className='dropdown-divider' />
                    <Link className='dropdown-item' to='' onClick={this.logout}>Logout</Link>
                  </div>
                </li>
              )
            }
            { isLoggedIn !== 'true'
              && !loginPath && <li><NavLink to='/login' className='guest-link'>Login</NavLink></li>
            }
            {isLoggedIn !== 'true'
              && !signupPath && <li><NavLink to='/signup' className='guest-link'>Sign Up</NavLink></li>
            }
          </ul>
        </div>
      </nav>
    );
  }
}
export default Navbar;
