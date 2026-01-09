import React from 'react';
import './ClearButton.css'; // Reuse the same styling as ClearButton

interface DeleteButtonProps {
  onDelete: () => void;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, disabled = false }) => {
  return (
    <button 
      className="clear-button"
      onClick={onDelete}
      type="button"
      disabled={disabled}
    >
      Delete Snapshot
    </button>
  );
};

export default DeleteButton;