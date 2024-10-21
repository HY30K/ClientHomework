import React, { useState, useEffect } from 'react';
import './App.css';
import TokenInput from './components/TokenInput';
import SwapButton from './components/SwapButton';
import Modal from './components/Modal';

const tokenList = [
  { symbol: 'ETH', name: 'Ether' },
  { symbol: 'WETH', name: 'Wrapped Ether' },
  { symbol: 'DAI', name: 'Dai' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  { symbol: 'AAVE', name: 'Aave' },
];

const App: React.FC = () => {
  const [amountFrom, setAmountFrom] = useState<string>('');
  const [amountTo, setAmountTo] = useState<string>('');
  const [isFromFocused, setIsFromFocused] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedToken1, setSelectedToken1] = useState<string>('ETH');
  const [selectedToken2, setSelectedToken2] = useState<string>('USDC');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [recentTokens, setRecentTokens] = useState<string[]>([]);

  const [selectedTokenInput, setSelectedTokenInput] = useState<1 | 2>(1);

  // localStorage에서 최근 선택한 토큰 불러오기
  useEffect(() => {
    const savedToken1 = localStorage.getItem('selectedToken1');
    const savedToken2 = localStorage.getItem('selectedToken2');
    const savedRecentTokens = localStorage.getItem('recentTokens');

    if (savedToken1) {
      setSelectedToken1(savedToken1);
    }
    if (savedToken2) {
      setSelectedToken2(savedToken2);
    }
    if (savedRecentTokens) {
      setRecentTokens(JSON.parse(savedRecentTokens));
    }
  }, []);

  // 최근 선택한 토큰을 localStorage에 저장하기
  useEffect(() => {
    localStorage.setItem('selectedToken1', selectedToken1);
    localStorage.setItem('selectedToken2', selectedToken2);
    localStorage.setItem('recentTokens', JSON.stringify(recentTokens));
  }, [selectedToken1, selectedToken2, recentTokens]);

  const handleAlert = () => {
    alert('준비 중입니다');
  };

  const handleOpenModal = (inputNumber: 1 | 2) => {
    setSelectedTokenInput(inputNumber);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTokenSelect = (token: string) => {
    if (selectedTokenInput === 1) {
      setSelectedToken1(token);
    } else if (selectedTokenInput === 2) {
      setSelectedToken2(token);
    }

    updateRecentTokens(token);
    handleCloseModal();
  };

  const updateRecentTokens = (token: string) => {
    setRecentTokens((prev) => {
      const newRecent = [token, ...prev.filter((t) => t !== token)];
      return newRecent.slice(0, 7);
    });
  };

  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountFrom(value);
    if (isFromFocused) {
      const calculatedAmount = calculateSwap(value);
      setAmountTo(calculatedAmount);
    }
  };

  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountTo(value);
    if (!isFromFocused) {
      const calculatedAmount = calculateSwapReverse(value);
      setAmountFrom(calculatedAmount);
    }
  };

  const calculateSwap = (value: string) => {
    const rate = 1.1;
    return (parseFloat(value) * rate).toFixed(2);
  };

  const calculateSwapReverse = (value: string) => {
    const rate = 1.1;
    return (parseFloat(value) / rate).toFixed(2);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="swap-container">
          <div className="swap-header">
            <h3>스왑</h3>
            <button className="settings-button" onClick={handleAlert}>⚙️</button>
          </div>

          <TokenInput
            amount={amountFrom}
            onAmountChange={handleAmountFromChange}
            isFocused={isFromFocused}
            setIsFocused={setIsFromFocused}
            selectedToken={selectedToken1}
            onTokenSelect={() => handleOpenModal(1)} 
          />

          <div className="swap-arrow">
            <button>⬇️</button>
          </div>

          <TokenInput
            amount={amountTo}
            onAmountChange={handleAmountToChange}
            isFocused={!isFromFocused}
            setIsFocused={() => setIsFromFocused(false)}
            selectedToken={selectedToken2}
            onTokenSelect={() => handleOpenModal(2)} 
          />

          <SwapButton
            amountFrom={amountFrom}
            amountTo={amountTo}
            onSwap={handleAlert}
          />
        </div>

        <footer>
          <p>Uniswap 사용 가능: <a href="/">English</a></p>
        </footer>
      </header>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAlert={handleAlert}
        tokens={tokenList}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        recentTokens={recentTokens}
        onTokenSelect={handleTokenSelect}
      />
    </div>
  );
};

export default App;
