import React from 'react';

interface SwapButtonProps {
  amountFrom: string;
  amountTo: string;
  onSwap: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({ amountFrom, amountTo, onSwap }) => {
  return (
    <button
      className={`swap-button ${(amountFrom && amountTo) ? 'enabled' : ''}`}
      onClick={onSwap}
      disabled={!(amountFrom && amountTo)}
    >
      {(amountFrom && amountTo) ? '스왑' : '금액을 입력하세요'}
    </button>
  );
};

export default SwapButton;
