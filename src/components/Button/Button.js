import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ label, variant = 'primary', onClick, disabled = false }) => {
  return (
    <button
      className={`button ${variant} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
