import React, { useState } from 'react';
import { SaveButtonProps } from '../types';
import './SaveButton.css';

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) {
      return;
    }

    setIsLoading(true);
    setShowSuccess(false);

    try {
      // Call the save function
      await onSave();
      
      // Show success feedback
      setShowSuccess(true);
      
      // Hide success feedback after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Save operation failed:', error);
      // Error handling - could be extended with error state display
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Saving...';
    }
    if (showSuccess) {
      return 'Saved!';
    }
    return 'Save';
  };

  const getButtonClass = () => {
    let className = 'save-button';
    
    if (disabled) {
      className += ' save-button--disabled';
    } else if (isLoading) {
      className += ' save-button--loading';
    } else if (showSuccess) {
      className += ' save-button--success';
    }
    
    return className;
  };

  return (
    <button
      type="button"
      className={getButtonClass()}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label="Save current data as snapshot"
    >
      <span className="save-button__text">
        {getButtonText()}
      </span>
      {isLoading && (
        <span className="save-button__spinner" aria-hidden="true">
          ⟳
        </span>
      )}
      {showSuccess && (
        <span className="save-button__checkmark" aria-hidden="true">
          ✓
        </span>
      )}
    </button>
  );
};

export default SaveButton;