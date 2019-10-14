import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ style, textColor, children }) => {
    const renderOutlineButton = ({ textColor }) => {
        return (
            <button
                className={`bg-transparent hover:bg-primary text-${textColor} hover:text-white font-bold py-2 px-4 rounded border border-primary`}
            >
                {children}
            </button>
        );
    };

    switch (style) {
        case 'outline':
            return renderOutlineButton({ textColor: textColor || 'primary' });
        default:
            return (
                <button
                    className={`bg-primary hover:bg-primary-dark text-${textColor ||
                        'white'} hover:text-primary-light font-bold py-2 px-4 rounded`}
                >
                    {children}
                </button>
            );
    }
};

export default Button;

Button.propTypes = {
    style: PropTypes.string,
    textColor: PropTypes.string,
    children: PropTypes.any,
};

Button.defaultProps = {
    style: 'default',
};
