import React, { useState, useEffect } from 'react'; // React 및 필요한 hooks(useState, useEffect)를 가져옴
import './App.css'; // 스타일 파일을 가져옴
import TokenInput from './components/TokenInput'; // TokenInput 컴포넌트를 가져옴
import SwapButton from './components/SwapButton'; // SwapButton 컴포넌트를 가져옴
import Modal from './components/Modal'; // Modal 컴포넌트를 가져옴

// 사용 가능한 토큰 목록을 정의
const tokenList = [
  { symbol: 'ETH', name: 'Ether' },
  { symbol: 'WETH', name: 'Wrapped Ether' },
  { symbol: 'DAI', name: 'Dai' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  { symbol: 'AAVE', name: 'Aave' },
];

// App 컴포넌트 정의
const App: React.FC = () => {
  // 상태 변수 선언
  const [amountFrom, setAmountFrom] = useState<string>(''); // From 입력 필드 값
  const [amountTo, setAmountTo] = useState<string>(''); // To 입력 필드 값
  const [isFromFocused, setIsFromFocused] = useState<boolean>(true); // 어떤 입력이 포커스 되었는지 상태

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달이 열려 있는지 여부
  const [selectedToken1, setSelectedToken1] = useState<string>('ETH'); // 첫 번째 토큰 선택
  const [selectedToken2, setSelectedToken2] = useState<string>('USDC'); // 두 번째 토큰 선택
  const [searchTerm, setSearchTerm] = useState<string>(''); // 토큰 검색어 상태
  const [recentTokens, setRecentTokens] = useState<string[]>([]); // 최근 선택한 토큰 목록

  const [selectedTokenInput, setSelectedTokenInput] = useState<1 | 2>(1); // 현재 선택된 입력 필드 (1번 또는 2번)

  // 컴포넌트가 마운트될 때 localStorage에서 최근 선택한 토큰을 불러오는 useEffect
  useEffect(() => {
    const savedToken1 = localStorage.getItem('selectedToken1'); // localStorage에서 첫 번째 토큰 가져오기
    const savedToken2 = localStorage.getItem('selectedToken2'); // localStorage에서 두 번째 토큰 가져오기
    const savedRecentTokens = localStorage.getItem('recentTokens'); // 최근 선택한 토큰 목록 가져오기

    if (savedToken1) {
      setSelectedToken1(savedToken1); // 불러온 값으로 첫 번째 토큰 상태 업데이트
    }
    if (savedToken2) {
      setSelectedToken2(savedToken2); // 불러온 값으로 두 번째 토큰 상태 업데이트
    }
    if (savedRecentTokens) {
      setRecentTokens(JSON.parse(savedRecentTokens)); // 불러온 값을 JSON으로 파싱하고 최근 토큰 상태 업데이트
    }
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행됨

  // 토큰 선택 및 최근 토큰 목록을 localStorage에 저장하는 useEffect
  useEffect(() => {
    localStorage.setItem('selectedToken1', selectedToken1); // 첫 번째 토큰을 localStorage에 저장
    localStorage.setItem('selectedToken2', selectedToken2); // 두 번째 토큰을 localStorage에 저장
    localStorage.setItem('recentTokens', JSON.stringify(recentTokens)); // 최근 선택한 토큰 목록을 JSON으로 변환해 저장
  }, [selectedToken1, selectedToken2, recentTokens]); // 상태가 변경될 때마다 실행됨

  // 알림 함수 (사용자가 준비되지 않은 기능을 클릭할 때 호출)
  const handleAlert = () => {
    alert('준비 중입니다');
  };

  // 토큰 선택 모달을 열기 위한 함수
  const handleOpenModal = (inputNumber: 1 | 2) => {
    setSelectedTokenInput(inputNumber); // 현재 선택된 입력 필드 (1번 또는 2번)를 저장
    setIsModalOpen(true); // 모달을 엶
  };

  // 모달을 닫는 함수
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달을 닫음
  };

  // 토큰을 선택했을 때 호출되는 함수
  const handleTokenSelect = (token: string) => {
    if (selectedTokenInput === 1) {
      setSelectedToken1(token); // 첫 번째 토큰을 변경
    } else if (selectedTokenInput === 2) {
      setSelectedToken2(token); // 두 번째 토큰을 변경
    }

    updateRecentTokens(token); // 선택된 토큰을 최근 토큰 목록에 추가
    handleCloseModal(); // 모달 닫기
  };

  // 최근 선택한 토큰을 업데이트하는 함수 (최대 7개까지만 유지)
  const updateRecentTokens = (token: string) => {
    setRecentTokens((prev) => {
      const newRecent = [token, ...prev.filter((t) => t !== token)]; // 중복된 토큰을 제거하고 새로운 토큰을 맨 앞에 추가
      return newRecent.slice(0, 7); // 최근 7개 토큰까지만 유지
    });
  };

  // From 입력 필드 값이 변경되었을 때 호출되는 핸들러
  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountFrom(value); // 입력된 값을 amountFrom 상태에 저장
    if (isFromFocused) {
      const calculatedAmount = calculateSwap(value); // 스왑 계산 함수 호출
      setAmountTo(calculatedAmount); // 계산된 값을 amountTo에 저장
    }
  };

  // To 입력 필드 값이 변경되었을 때 호출되는 핸들러
  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountTo(value); // 입력된 값을 amountTo 상태에 저장
    if (!isFromFocused) {
      const calculatedAmount = calculateSwapReverse(value); // 반대 스왑 계산 함수 호출
      setAmountFrom(calculatedAmount); // 계산된 값을 amountFrom에 저장
    }
  };

  // 스왑 계산 함수 (From -> To) - 스왑 비율 1.1을 사용하여 From 입력값을 변환
  const calculateSwap = (value: string) => {
    const rate = 1.1; // 스왑 비율
    return (parseFloat(value) * rate).toFixed(2); // 입력된 금액을 비율에 따라 변환하고 소수점 2자리로 고정
  };

  // 스왑 계산 함수 (To -> From) - 반대 방향 계산
  const calculateSwapReverse = (value: string) => {
    const rate = 1.1; // 스왑 비율
    return (parseFloat(value) / rate).toFixed(2); // 입력된 금액을 비율에 따라 반대로 변환
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* 스왑 UI 컨테이너 */}
        <div className="swap-container">
          <div className="swap-header">
            <h3>스왑</h3>
            <button className="settings-button" onClick={handleAlert}>⚙️</button>
          </div>

          {/* 첫 번째 TokenInput 컴포넌트 (From 필드) */}
          <TokenInput
            amount={amountFrom}                      // 입력된 From 금액
            onAmountChange={handleAmountFromChange}  // 금액 변경 핸들러
            isFocused={isFromFocused}                // 포커스 상태 전달
            setIsFocused={setIsFromFocused}          // 포커스 상태 변경 함수 전달
            selectedToken={selectedToken1}           // 선택된 첫 번째 토큰
            onTokenSelect={() => handleOpenModal(1)} // 토큰 선택 버튼 클릭 시 모달 열기
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
          isOpen={isModalOpen}              // 모달이 열려 있는지 여부
          onClose={handleCloseModal}        // 모달 닫기 함수
          onAlert={handleAlert}             // 알림 호출 함수
          tokens={tokenList}                // 토큰 리스트 전달
          searchTerm={searchTerm}           // 검색어 상태 전달
          setSearchTerm={setSearchTerm}     // 검색어 변경 함수 전달
          recentTokens={recentTokens}       // 최근 선택한 토큰 목록 전달
          onTokenSelect={handleTokenSelect} // 토큰 선택 시 호출되는 함수
        />
      </header>
    </div>
  );
};

// App 컴포넌트 외부로 내보내기
export default App;
