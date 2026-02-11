import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({ text, color = 'gray' }) => {
  return (
    <span className={`badge ${color}`}>
      {text}
    </span>
  );
};

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'
  ]),
};

export default Badge;
