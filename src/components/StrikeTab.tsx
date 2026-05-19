import React, { useState, useEffect } from 'react';
import './StrikeTab.css';
import './StrikePriceTable.css';
import './PriceInput.css';

const BASE_INCREMENTS = [5, 10, 15, 20, 25];
const STORAGE_KEY_PREFIX = 'strike_tab_base_';
const OFFSET_STORAGE_KEY = 'strike_tab_offset';

interface StrikeTableCardProps {
  index: number;
  increments: number[];
}

const StrikeTableCard: React.FC<StrikeTableCardProps> = ({ index, increments }) => {
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

  const formatValue = (val: number): string => {
    return Number.isInteger(val) ? val.toString() : val.toFixed(1);
  };

  const formatIncrement = (inc: number): string => {
    return Number.isInteger(inc) ? `+${inc}` : `+${inc.toFixed(1)}`;
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
                {formatIncrement(inc)}
              </td>
            ))}
          </tr>
          <tr className="strike-row strike-row--call">
            <td className="strike-cell strike-cell--label strike-cell--green">CALL</td>
            {increments.map((inc) => (
              <td key={`call-${inc}`} className="strike-cell strike-cell--green">
                {formatValue(price + inc)}
              </td>
            ))}
          </tr>
          <tr className="strike-row strike-row--put">
            <td className="strike-cell strike-cell--label strike-cell--red">PUT</td>
            {increments.map((inc) => (
              <td key={`put-${inc}`} className="strike-cell strike-cell--red">
                {formatValue(price - inc)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const StrikeTab: React.FC = () => {
  const [offset, setOffset] = useState<string>(() => {
    try {
      return localStorage.getItem(OFFSET_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(OFFSET_STORAGE_KEY, offset);
    } catch {
      // localStorage unavailable
    }
  }, [offset]);

  const offsetValue = parseFloat(offset) || 0;
  const rightIncrements = BASE_INCREMENTS.map(inc => inc + offsetValue);

  return (
    <div className="strike-tab">
      <div className="strike-tab__offset">
        <label className="strike-tab__offset-label">Offset:</label>
        <input
          type="text"
          className="strike-tab__offset-input"
          value={offset}
          onChange={(e) => setOffset(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          autoComplete="off"
        />
      </div>
      <div className="strike-tab__row">
        <StrikeTableCard key={0} index={0} increments={BASE_INCREMENTS} />
        <StrikeTableCard key={1} index={1} increments={rightIncrements} />
        <StrikeTableCard key={2} index={2} increments={BASE_INCREMENTS} />
        <StrikeTableCard key={3} index={3} increments={rightIncrements} />
      </div>
    </div>
  );
};

export default StrikeTab;
