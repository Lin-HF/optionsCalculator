import React from 'react';
import { TabNavigationProps } from '../types';
import './TabNavigation.css';

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'main' ? 'active' : ''}`}
          onClick={() => onTabChange('main')}
          type="button"
        >
          Main
        </button>
        <button
          className={`tab-button ${activeTab === 'strike' ? 'active' : ''}`}
          onClick={() => onTabChange('strike')}
          type="button"
        >
          Strike
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => onTabChange('history')}
          type="button"
        >
          History
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;