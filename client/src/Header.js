 import React from 'react'
import { FaPaw } from "react-icons/fa";
import './Header.css';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header className="bg-black">
       <nav className="navbar navbar-dark bg-dark navbar-expand-lg  position-sticky">
         <div className="container " >
             
             <a className="navbar-brand" href="#">
                <FaPaw className="me-2 mb-1"/>
                Pawsitive Insights
            </a>
             <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
             <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login </Link>
              </li>
             
            </ul>
          </div>
         </div>
       </nav>
    </header>
  )
}

export default Header