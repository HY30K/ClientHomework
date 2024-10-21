import React from 'react';

interface TokenInputProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  selectedToken: string;
  onTokenSelect: (token: string) => void;
  openModal: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({
  amount, onAmountChange, isFocused, setIsFocused, selectedToken, onTokenSelect, openModal
}) => {
  return (
    <div className="input-group">
      <input
        type="number"
        placeholder="0.0"
        value={amount}
        onChange={onAmountChange}
        className="input"
        onFocus={() => setIsFocused(true)}
        step="0.0000000001"
      />
      <button className="token-select" onClick={openModal}>{selectedToken}</button>
    </div>
  );
};

export default TokenInput;
