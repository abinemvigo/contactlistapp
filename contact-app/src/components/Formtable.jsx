import React, { useState } from 'react';
import "../App.css";
import { MdClose } from 'react-icons/md';

const Formtable = ({ handleSubmit, handleOnChange, handleClose, rest }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const { name, email, phone, address } = rest;
    const errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!phone) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone is invalid";
    }

    if (!address) {
      errors.address = "Address is required";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="addContainer">
      <form onSubmit={submitForm}>
        <div className="close-btn" onClick={handleClose}><MdClose /></div>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" name="name" onChange={handleOnChange} value={rest.name} />
        {errors.name && <span className="error">{errors.name}</span>}

        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" onChange={handleOnChange} value={rest.email} />
        {errors.email && <span className="error">{errors.email}</span>}

        <label htmlFor="phone">Mobile: </label>
        <input type="number" id="phone" name="phone" onChange={handleOnChange} value={rest.phone} />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <label htmlFor="address">Address: </label>
        <textarea id="address" name="address" onChange={handleOnChange} value={rest.address} />
        {errors.address && <span className="error">{errors.address}</span>}

        <button className="btn">Submit</button>
      </form>
    </div>
  );
};

export default Formtable;
