import React, { useState } from "react";
import "./signup.styles.scss";

import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {setAlert} from '../../redux/alert-reducer/alert.actions'

import axios from 'axios';

const Signup = ({setAlert}) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = userData;

  const onChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setAlert("Password doesn't match",'danger');
    } else {
      console.log(userData);
      const newUser = {
        name,
        email,
        password
      }
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const body = JSON.stringify(newUser);

        const res = await axios.post('/api/users',body,config);
        console.log(res.data);
      } catch (error) {
        console.error(error.response.data);
      }
    }
  };

  return (
    <div className="signup-container  container">
      <div className="signup-fields">
        <h1>SIGN UP</h1>
        <form className="forms" onSubmit={(event) => onSubmit(event)}>
          <input
            placeholder="Name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => onChange(event)}
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => onChange(event)}
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => onChange(event)}
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => onChange(event)}
          />
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        
      </div>
    </div>
  );
};
//This prop is required and it has to be a function
//allows type checking in javascript
Signup.propTypes = {
  setAlert: PropTypes.func.isRequired
};

const mapDispatchToProps=(dispatch)=>({
  setAlert: (message, alertType)=> dispatch(setAlert(message,alertType))
});

export default connect(null,mapDispatchToProps)(Signup);
