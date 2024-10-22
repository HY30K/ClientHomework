import React from 'react';

interface SwapHeaderProps {
  onAlert: () => void;
}

const SwapHeader: React.FC<SwapHeaderProps> = ({ onAlert }) => (
  <div className="swap-header">
    <h3>스왑</h3>
    <button className="settings-button" onClick={onAlert}>⚙️</button>
  </div>
);

export default SwapHeader;
