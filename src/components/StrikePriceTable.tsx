import React, { useState, useEffect } from 'react';
import './StrikePriceTable.css';
import './PriceInput.css';

const STORAGE_KEY = 'strike_price_base_value';

const StrikePriceTable: React.FC = () => {
  const [basePrice, setBasePrice] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const price = parseFloat(basePrice) || 0;

  const increments = [5, 10, 15];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, basePrice);
    } catch {
      // localStorage unavailable
    }
  }, [basePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasePrice(e.target.value);
  };

  return (
    <div className="strike-price-table">
      <div className="price-input-container">
        <span className="currency-symbol">$</span>
        <input
          type="text"
          className="price-input strike-price-neutral"
          value={basePrice}
          onChange={handleChange}
          placeholder="0"
          inputMode="decimal"
          autoComplete="off"
        />
      </div>
      <table className="strike-table">
        <tbody>
          <tr className="strike-row strike-row--header">
            <td className="strike-cell strike-cell--label"></td>
            {increments.map((inc) => (
              <td key={`inc-${inc}`} className="strike-cell strike-cell--header">
                +{inc}
              </td>
            ))}
          </tr>
          <tr className="strike-row strike-row--call">
            <td className="strike-cell strike-cell--label strike-cell--green">CALL</td>
            {increments.map((inc) => (
              <td key={`call-${inc}`} className="strike-cell strike-cell--green">
                {price + inc}
              </td>
            ))}
          </tr>
          <tr className="strike-row strike-row--put">
            <td className="strike-cell strike-cell--label strike-cell--red">PUT</td>
            {increments.map((inc) => (
              <td key={`put-${inc}`} className="strike-cell strike-cell--red">
                {price - inc}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StrikePriceTable;
