import React, { useState, useEffect } from 'react'; // React 및 필요한 hooks(useState, useEffect)를 가져옴
import './App.css'; // 스타일 파일을 가져옴

import TokenInput from './components/TokenInput'; // TokenInput 컴포넌트를 가져옴
import SwapButton from './components/SwapButton'; // SwapButton 컴포넌트를 가져옴
import SwapHeader from './components/SwapHeader'; // SwapHeader 컴포넌트를 가져옴
import SwapArrow from './components/SwapArrow';   // SwapArrow 컴포넌트를 가져옴
import Footer from './components/Footer';         // FOoter 컴포넌트를 가져옴
import Modal from './components/Modal/Modal';           // Modal 컴포넌트를 가져옴
import TOKENS from './enum/TokenList';
import axios from 'axios';


const App: React.FC = () => {
  // 상태 변수 선언
  const [swapFromRate, setSwapFromRate] = useState<number>(1);            // 가져온 From 토큰의 달러 환율
  const [swapToRate, setSwapToRate] = useState<number>(1);                // 가져온 To 토큰의 달러 환율

  const [amountFrom, setAmountFrom] = useState<string>('');               // From 필드의 금액 상태
  const [amountTo, setAmountTo] = useState<string>('');                   // To 필드의 금액 상태
  const [isFromFocused, setIsFromFocused] = useState<boolean>(true);      // From 필드 포커스 상태
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);         // 모달 열림 여부
  const [selectedTokenFrom, setSelectedTokenFrom] = useState<string>('DAI');    // 첫 번째 선택된 토큰
  const [selectedTokenTo, setSelectedTokenTo] = useState<string>('USDC');   // 두 번째 선택된 토큰
  const [searchTerm, setSearchTerm] = useState<string>('');               // 토큰 검색어 상태
  const [recentTokens, setRecentTokens] = useState<string[]>([]);         // 최근 선택한 토큰 목록 상태
  const [selectedTokenInput, setSelectedTokenInput] = useState<1 | 2>(1); // 현재 선택된 입력 필드 (1번 또는 2번)

  // 컴포넌트가 마운트될 때 localStorage에서 최근 선택한 토큰을 불러오는 useEffect
  useEffect(() => {
    const loadTokensFromLocalStorage = () => {
      const savedToken1 = localStorage.getItem('selectedToken1');     // localStorage에서 첫 번째 토큰 가져오기
      const savedToken2 = localStorage.getItem('selectedToken2');     // localStorage에서 두 번째 토큰 가져오기
      const savedRecentTokens = localStorage.getItem('recentTokens'); // 최근 선택한 토큰 목록 가져오기

      // 저장된 토큰이 있을 경우 상태 업데이트
      if (savedToken1) setSelectedTokenFrom(savedToken1);
      if (savedToken2) setSelectedTokenTo(savedToken2);
      if (savedRecentTokens) setRecentTokens(JSON.parse(savedRecentTokens)); // JSON 파싱하여 상태 업데이트
    };

    loadTokensFromLocalStorage(); // 토큰 로드 함수 호출
  }, []);


  // 토큰 선택 및 최근 토큰 목록을 localStorage에 저장하는 useEffect
  useEffect(() => {
    localStorage.setItem('selectedToken1', selectedTokenFrom);             // 첫 번째 토큰을 localStorage에 저장
    localStorage.setItem('selectedToken2', selectedTokenTo);             // 두 번째 토큰을 localStorage에 저장
    localStorage.setItem('recentTokens', JSON.stringify(recentTokens)); // 최근 선택한 토큰 목록을 JSON으로 변환하여 저장

    getFromSwapRate(getTokenID(selectedTokenFrom));
    getToSwapRate(getTokenID(selectedTokenTo));

  }, [selectedTokenFrom, selectedTokenTo, recentTokens]);                   // 상태가 변경될 때마다 실행됨

  const getTokenID = (symbol: string) => {
    const token = TOKENS.find(token => token.symbol === symbol);
    return token ? token.id : '';
  }

  // 알림 함수 (사용자가 준비되지 않은 기능을 클릭할 때 호출)
  const handleAlert = () => alert('준비 중입니다'); // 알림 메시지 표시

  // 모달 열기 함수
  const handleOpenModal = (inputNumber: 1 | 2) => {
    setSelectedTokenInput(inputNumber); // 현재 선택된 입력 필드 상태 업데이트
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기 함수
  const handleCloseModal = () => setIsModalOpen(false); // 모달 닫기


  // 토큰 선택 처리 함수
  const handleTokenSelect = (token: string) => {
    // 선택된 입력 필드에 따라 첫 번째 또는 두 번째 토큰 업데이트
    if (selectedTokenInput === 1) {
      setSelectedTokenFrom(token); // 첫 번째 토큰 선택
    } else {
      setSelectedTokenTo(token); // 두 번째 토큰 선택
    }
    updateRecentTokens(token); // 선택한 토큰을 최근 토큰 목록에 추가
    handleCloseModal(); // 모달 닫기
  };


  // 최근 선택한 토큰 업데이트 함수 (최대 7개까지만 유지)
  const updateRecentTokens = (token: string) => {
    setRecentTokens(prev => {
      const updatedTokens = [token, ...prev.filter(t => t !== token)].slice(0, 7); // 중복 제거 및 최근 7개 토큰 유지
      localStorage.setItem('recentTokens', JSON.stringify(updatedTokens));         // 업데이트된 최근 토큰 목록 저장
      return updatedTokens; // 업데이트된 토큰 목록 반환
    });
  };


  // From 입력 필드 값 변경 처리 함수
  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값
    setAmountFrom(value);         // amountFrom 상태 업데이트

    if (value === '') {
      setAmountTo(''); // 빈 문자열이면 To 필드도 비우기
      return;
    }

    if (isFromFocused) {
      setAmountTo(calculateFromSwap(value)); // From 필드에 포커스가 있을 경우 To 필드 값 계산
    }
  };

  // To 입력 필드 값 변경 처리 함수
  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값
    setAmountTo(value);           // amountTo 상태 업데이트

    if (value === '') {
      setAmountFrom(''); // 빈 문자열이면 To 필드도 비우기
      return;
    }

    if (!isFromFocused) {
      setAmountFrom(calculateToSwap(value)); // To 필드에 포커스가 없을 경우 From 필드 값 계산
    }
  };


  // 스왑 계산 함수 (From -> To)
  const getFromSwapRate = (ids: string) => {
    axios.get(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=${ids}`)
      .then(res => {
        setSwapFromRate(res.data[ids]);
      });
  }

  // 스왑 계산 함수 (To -> From)
  const getToSwapRate = (ids: string) => {
    axios.get(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=${ids}`)
      .then(res => {
        setSwapToRate(res.data[ids]);
      });
  }

  const calculateFromSwap = (value: string) => ((parseFloat(value) * swapFromRate) / swapToRate).toFixed(10); // 입력값을 스왑비율로 나누어 소수점 10자리로 고정
  const calculateToSwap = (value: string) => ((parseFloat(value) * swapToRate) / swapFromRate).toFixed(10); // 입력값을 스왑비율로 나누어 소수점 10자리로 고정

  return (
    <div className="App">
      <header className="App-header">
        <div className="swap-container">

          {/* SwapHeader 컴포넌트 사용 */}
          <SwapHeader onAlert={handleAlert} />

          {/* 첫 번째 TokenInput 컴포넌트 (From 필드) */}
          <TokenInput
            amount={amountFrom}                       // 입력된 From 금액
            onAmountChange={handleAmountFromChange}   // 금액 변경 핸들러
            isFocused={isFromFocused}                 // 포커스 상태
            setIsFocused={setIsFromFocused}           // 포커스 상태 변경 함수
            selectedToken={selectedTokenFrom}            // 선택된 첫 번째 토큰
            onTokenSelect={() => handleOpenModal(1)}  // 토큰 선택 버튼 클릭 시 모달 열기
          />

          {/* 스왑 화살표 */}
          <SwapArrow />

          {/* 두 번째 TokenInput 컴포넌트 (To 필드) */}
          <TokenInput
            amount={amountTo} // 입력된 To 금액
            onAmountChange={handleAmountToChange}         // 금액 변경 핸들러
            isFocused={!isFromFocused}                    // 포커스 상태 (반대)
            setIsFocused={() => setIsFromFocused(false)}  // 포커스 상태 변경 함수
            selectedToken={selectedTokenTo}                // 선택된 두 번째 토큰
            onTokenSelect={() => handleOpenModal(2)}      // 토큰 선택 버튼 클릭 시 모달 열기
          />

          {/* 스왑 버튼 */}
          <SwapButton
            amountFrom={amountFrom} // From 필드 금액
            amountTo={amountTo}     // To 필드 금액
            onSwap={handleAlert}    // 스왑 버튼 클릭 시 호출되는 함수
          />
        </div>

        {/* Footer 컴포넌트 사용 */}
        <Footer />

        {/* 모달 컴포넌트 */}
        <Modal
          isOpen={isModalOpen}              // 모달 열림 여부
          onClose={handleCloseModal}        // 모달 닫기 함수
          onAlert={handleAlert}             // 알림 함수
          tokens={TOKENS}                   // 사용할 수 있는 토큰 목록
          searchTerm={searchTerm}           // 검색어 상태
          setSearchTerm={setSearchTerm}     // 검색어 상태 업데이트 함수
          recentTokens={recentTokens}       // 최근 선택한 토큰 목록
          onTokenSelect={handleTokenSelect} // 토큰 선택 함수
        />
      </header>
    </div>
  );
};

export default App; // App 컴포넌트를 내보냄
