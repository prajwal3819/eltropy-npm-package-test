import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Card;
