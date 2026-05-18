import React, { useState, useEffect } from 'react';
import './StrikeTab.css';
import './StrikePriceTable.css';
import './PriceInput.css';

const STRIKE_INCREMENTS = [5, 10, 15, 20, 25];
const STORAGE_KEY_PREFIX = 'strike_tab_base_';

interface StrikeTableCardProps {
  index: number;
}

const StrikeTableCard: React.FC<StrikeTableCardProps> = ({ index }) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${index}`;

  const [basePrice, setBasePrice] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, basePrice);
    } catch {
      // localStorage unavailable
    }
  }, [basePrice, storageKey]);

  const price = parseFloat(basePrice) || 0;

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
            {STRIKE_INCREMENTS.map((inc) => (
              <td key={`inc-${inc}`} className="strike-cell strike-cell--header">
                +{inc}
              </td>
            ))}
          </tr>
          <tr className="strike-row strike-row--call">
            <td className="strike-cell strike-cell--label strike-cell--green">CALL</td>
            {STRIKE_INCREMENTS.map((inc) => (
              <td key={`call-${inc}`} className="strike-cell strike-cell--green">
                {price + inc}
              </td>
            ))}
          </tr>
          <tr className="strike-row strike-row--put">
            <td className="strike-cell strike-cell--label strike-cell--red">PUT</td>
            {STRIKE_INCREMENTS.map((inc) => (
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

const StrikeTab: React.FC = () => {
  return (
    <div className="strike-tab">
      <div className="strike-tab__row">
        {[0, 1, 2, 3].map((index) => (
          <StrikeTableCard key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StrikeTab;
