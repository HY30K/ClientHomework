import React, { useState, useEffect } from 'react';
import './App.css';
import TokenInput from './components/TokenInput'; // TokenInput 컴포넌트 가져오기
import SwapButton from './components/SwapButton'; // SwapButton 컴포넌트 가져오기
import Modal from './components/Modal'; // Modal 컴포넌트 가져오기

// 토큰 리스트 정의
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
  // 상태 변수 선언
  const [amountFrom, setAmountFrom] = useState<string>(''); // From 입력 필드 값
  const [amountTo, setAmountTo] = useState<string>(''); // To 입력 필드 값
  const [isFromFocused, setIsFromFocused] = useState<boolean>(true); // 어떤 입력이 포커스 되었는지

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달이 열려 있는지 여부
  const [selectedToken1, setSelectedToken1] = useState<string>('ETH'); // 1번 토큰 선택
  const [selectedToken2, setSelectedToken2] = useState<string>('USDC'); // 2번 토큰 선택
  const [searchTerm, setSearchTerm] = useState<string>(''); // 토큰 검색어
  const [recentTokens, setRecentTokens] = useState<string[]>([]); // 최근 선택한 토큰 목록

  const [selectedTokenInput, setSelectedTokenInput] = useState<1 | 2>(1); // 현재 선택된 입력 (1번 또는 2번)

  // localStorage에서 최근 선택한 토큰과 최근 토큰 목록을 불러오는 useEffect
  useEffect(() => {
    const savedToken1 = localStorage.getItem('selectedToken1'); // localStorage에서 1번 토큰 불러오기
    const savedToken2 = localStorage.getItem('selectedToken2'); // localStorage에서 2번 토큰 불러오기
    const savedRecentTokens = localStorage.getItem('recentTokens'); // 최근 선택한 토큰 목록 불러오기

    if (savedToken1) {
      setSelectedToken1(savedToken1); // 불러온 값으로 상태 업데이트
    }
    if (savedToken2) {
      setSelectedToken2(savedToken2); // 불러온 값으로 상태 업데이트
    }
    if (savedRecentTokens) {
      setRecentTokens(JSON.parse(savedRecentTokens)); // 불러온 최근 토큰 목록을 JSON 파싱하여 상태 업데이트
    }
  }, []); // 컴포넌트가 처음 마운트될 때만 실행됨

  // 최근 선택한 토큰과 최근 토큰 목록을 localStorage에 저장하는 useEffect
  useEffect(() => {
    localStorage.setItem('selectedToken1', selectedToken1); // selectedToken1을 localStorage에 저장
    localStorage.setItem('selectedToken2', selectedToken2); // selectedToken2을 localStorage에 저장
    localStorage.setItem('recentTokens', JSON.stringify(recentTokens)); // 최근 토큰 목록을 localStorage에 저장
  }, [selectedToken1, selectedToken2, recentTokens]); // 상태가 변경될 때마다 실행됨

  // 알림 함수
  const handleAlert = () => {
    alert('준비 중입니다');
  };

  // 토큰 선택 모달 열기 함수
  const handleOpenModal = (inputNumber: 1 | 2) => {
    setSelectedTokenInput(inputNumber); // 현재 선택된 입력 번호 저장 (1번 또는 2번)
    setIsModalOpen(true); // 모달 열기
  };

  // 토큰 선택 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  // 토큰 선택 후 처리 함수
  const handleTokenSelect = (token: string) => {
    if (selectedTokenInput === 1) {
      setSelectedToken1(token); // 1번 입력 필드의 토큰을 변경
    } else if (selectedTokenInput === 2) {
      setSelectedToken2(token); // 2번 입력 필드의 토큰을 변경
    }

    updateRecentTokens(token); // 최근 선택한 토큰 업데이트
    handleCloseModal(); // 모달 닫기
  };

  // 최근 선택한 토큰을 관리하는 함수 (최대 7개까지 유지)
  const updateRecentTokens = (token: string) => {
    setRecentTokens((prev) => {
      const newRecent = [token, ...prev.filter((t) => t !== token)]; // 중복 제거 후 추가
      return newRecent.slice(0, 7); // 최대 7개로 제한
    });
  };

  // From 입력 값 변경 핸들러
  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountFrom(value); // 입력 필드 값 업데이트
    if (isFromFocused) {
      const calculatedAmount = calculateSwap(value); // 계산 로직 호출
      setAmountTo(calculatedAmount); // To 필드 값 업데이트
    }
  };

  // To 입력 값 변경 핸들러
  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountTo(value); // 입력 필드 값 업데이트
    if (!isFromFocused) {
      const calculatedAmount = calculateSwapReverse(value); // 반대 계산 로직 호출
      setAmountFrom(calculatedAmount); // From 필드 값 업데이트
    }
  };

  // 스왑 계산 함수 (From -> To)
  const calculateSwap = (value: string) => {
    const rate = 1.1; // 스왑 비율 (예시로 1.1을 사용)
    return (parseFloat(value) * rate).toFixed(2); // 계산된 값 반환
  };

  // 반대로 스왑 계산하는 함수 (To -> From)
  const calculateSwapReverse = (value: string) => {
    const rate = 1.1; // 스왑 비율 (예시로 1.1을 사용)
    return (parseFloat(value) / rate).toFixed(2); // 계산된 값 반환
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="swap-container">
          <div className="swap-header">
            <h3>스왑</h3>
            <button className="settings-button" onClick={handleAlert}>⚙️</button>
          </div>

          {/* 첫 번째 TokenInput 컴포넌트: From 입력 */}
          <TokenInput
            amount={amountFrom}
            onAmountChange={handleAmountFromChange}
            isFocused={isFromFocused}
            setIsFocused={setIsFromFocused}
            selectedToken={selectedToken1}
            onTokenSelect={() => handleOpenModal(1)} 
          />

          {/* 스왑 화살표 */}
          <div className="swap-arrow">
            <button>⬇</button>
          </div>

          {/* 두 번째 TokenInput 컴포넌트: To 입력 */}
          <TokenInput
            amount={amountTo}
            onAmountChange={handleAmountToChange}
            isFocused={!isFromFocused}
            setIsFocused={() => setIsFromFocused(false)}
            selectedToken={selectedToken2}
            onTokenSelect={() => handleOpenModal(2)} 
          />

          {/* 스왑 버튼 */}
          <SwapButton
            amountFrom={amountFrom}
            amountTo={amountTo}
            onSwap={handleAlert} // 스왑 버튼 클릭 시 호출되는 함수
          />
        </div>

        <footer>
          <p>Uniswap 사용 가능: <a href="/">English</a></p>
        </footer>

        {/* 모달 컴포넌트 */}
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
      </header>
    </div>
  );
};

export default App;
