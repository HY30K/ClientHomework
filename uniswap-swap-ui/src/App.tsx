import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [amountFrom, setAmountFrom] = useState<string>('');  // 상단 입력 필드 상태
  const [amountTo, setAmountTo] = useState<string>('');      // 하단 입력 필드 상태
  const [isFromFocused, setIsFromFocused] = useState<boolean>(true); // 어느 인풋이 포커스 되었는지 체크

  const handleSwap = () => {
    alert(`Swapping ${amountFrom} DAI to ${amountTo} USDC`);
  };

  const handleSettings = () => {
    alert('준비 중입니다');
  };

  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountFrom(value);
    // 여기에서 스왑 비율에 따른 계산 로직을 구현하세요
    if (isFromFocused) {
      const calculatedAmount = calculateSwap(value); // 가상 계산 함수
      setAmountTo(calculatedAmount);
    }
  };

  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountTo(value);
    // 반대로 하단 필드 입력 시 상단 필드도 반영
    if (!isFromFocused) {
      const calculatedAmount = calculateSwapReverse(value); // 반대로 계산하는 가상 함수
      setAmountFrom(calculatedAmount);
    }
  };

  const calculateSwap = (value: string) => {
    // 가상의 계산 로직, 환율 적용 가능
    const rate = 1.1; // 가정: DAI 1개 = USDC 1.1개
    return (parseFloat(value) * rate).toFixed(2);
  };

  const calculateSwapReverse = (value: string) => {
    // 가상의 반대로 계산하는 로직
    const rate = 1.1; // 동일하게 적용
    return (parseFloat(value) / rate).toFixed(2);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="swap-container">
          <div className="swap-header">
            <h3>스왑</h3>
            
            <button className="settings-button" onClick={handleSettings}>⚙️</button>

          </div>

          {/* From Token Input */}
          <div className="input-group">
            <input
              type="number"
              placeholder="0.0"
              value={amountFrom}
              onChange={handleAmountFromChange}
              className="input"
              onFocus={() => setIsFromFocused(true)}
              step="0.0000000001"
            />
            <button className="token-select">DAI</button>
          </div>

          {/* Swap Arrow */}
          <div className="swap-arrow">
            <button>↓</button>
          </div>

          {/* To Token Input */}
          <div className="input-group">
            <input
              type="number"
              placeholder="0.0"
              value={amountTo}
              onChange={handleAmountToChange}
              className="input"
              onFocus={() => setIsFromFocused(false)}
              step="0.0000000001"
            />
            <button className="token-select">USDC</button>
          </div>

          {/* Swap Button */}
          <button
            className={`swap-button ${(amountFrom && amountTo) ? 'enabled' : ''}`}
            onClick={handleSwap}
            disabled={!(amountFrom && amountTo)}
          >
            {(amountFrom && amountTo) ? '스왑' : '금액을 입력하세요'}
          </button>

        </div>

        <footer>
          <p>Uniswap 사용 가능: <a href="/">English</a></p>
        </footer>

      </header>
    </div>
  );
};

export default App;
