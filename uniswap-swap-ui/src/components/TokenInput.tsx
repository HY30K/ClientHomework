import React, { useState, useEffect } from 'react';

interface TokenInputProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  selectedToken: string;
  onTokenSelect: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({
  amount,
  onAmountChange,
  isFocused,
  setIsFocused,
  selectedToken,
  onTokenSelect,
}) => {
  const [storedToken, setStoredToken] = useState<string>(selectedToken);

  // localStorage에서 토큰 불러오기
  useEffect(() => {
    const savedToken = localStorage.getItem('storedToken');
    if (savedToken) {
      setStoredToken(savedToken);
    }
  }, []);

  // 토큰이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (storedToken) {
      localStorage.setItem('storedToken', storedToken);
    }
  }, [storedToken]);

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
      <button className="token-select" onClick={onTokenSelect}>
        {storedToken}
      </button>
    </div>
  );
};

export default TokenInput;
