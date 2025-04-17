import React from 'react'

const NavBar = () => {
  return (
    <div className="navbar">
        <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand">Personal Finance Visulaizer</a>
            <form class="d-flex" role="search">
            <input class="form-control me-2 nav-inp" type="search" placeholder="Search" aria-label="Search"/>
            <button class="btn btn-outline-success s-btn" type="submit">Search</button>
            </form>
        </div>
        </nav>
    </div>
  )
}

export default NavBar