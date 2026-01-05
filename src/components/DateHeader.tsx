import React from 'react';
import { DateHeaderProps } from '../types';
import { getFormattedFridayDate } from '../utils/dateUtils';
import './DateHeader.css';

const DateHeader: React.FC<DateHeaderProps> = ({ weekOffset }) => {
  // Get the formatted Friday date for the specified week offset
  const formattedDate = getFormattedFridayDate(weekOffset);

  return (
    <div className="date-header">
      <h2 className="date-title">{formattedDate}</h2>
    </div>
  );
};

export default DateHeader;