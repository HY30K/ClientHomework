import React, { useState, useEffect } from 'react'; // React 및 상태 관리와 사이드 이펙트를 위해 useState와 useEffect 훅을 가져옵니다.
import './App.css'; // 스타일 파일을 가져옵니다.
import TokenInput from './components/TokenInput'; // TokenInput 컴포넌트를 가져옵니다.
import SwapButton from './components/SwapButton'; // SwapButton 컴포넌트를 가져옵니다.
import SwapHeader from './components/SwapHeader'; // SwapHeader 컴포넌트를 가져옵니다.
import SwapArrow from './components/SwapArrow';   // SwapArrow 컴포넌트를 가져옵니다.
import Footer from './components/Footer';         // Footer 컴포넌트를 가져옵니다.
import Modal from './components/Modal/Modal';     // Modal 컴포넌트를 가져옵니다.
import TOKENS from './enum/TokenList';            // 토큰 리스트를 가져옵니다.
import axios, { AxiosError } from 'axios';        // Axios 및 AxiosError 타입을 가져옵니다.
import debounce from 'lodash/debounce';           // lodash의 debounce 함수를 가져옵니다.

const App: React.FC = () => { // App 컴포넌트를 정의합니다.
  // 상태 변수 선언
  const [swapFromRate, setSwapFromRate] = useState<number>(1);                // 'From' 토큰의 스왑 비율을 관리하는 상태.
  const [swapToRate, setSwapToRate] = useState<number>(1);                    // 'To' 토큰의 스왑 비율을 관리하는 상태.
  const [amountFrom, setAmountFrom] = useState<string>('');                   // 'From' 입력 필드의 금액을 관리하는 상태.
  const [amountTo, setAmountTo] = useState<string>('');                       // 'To' 입력 필드의 금액을 관리하는 상태.
  const [isFromFocused, setIsFromFocused] = useState<boolean>(true);          // 'From' 입력 필드가 포커스되었는지 여부를 관리하는 상태.
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);             // 모달의 열림 여부를 관리하는 상태.
  const [selectedTokenFrom, setSelectedTokenFrom] = useState<string>('DAI');  // 선택된 'From' 토큰을 관리하는 상태.
  const [selectedTokenTo, setSelectedTokenTo] = useState<string>('USDC');     // 선택된 'To' 토큰을 관리하는 상태.
  const [searchTerm, setSearchTerm] = useState<string>('');                   // 토큰 검색어를 관리하는 상태.
  const [recentTokens, setRecentTokens] = useState<string[]>([]);             // 최근 사용된 토큰 목록을 관리하는 상태.
  const [selectedTokenInput, setSelectedTokenInput] = useState<1 | 2>(1);     // 현재 선택된 입력 토큰을 관리하는 상태.

  // 컴포넌트가 처음 렌더링될 때 로컬 스토리지에서 토큰 정보를 로드합니다.
  useEffect(() => {
    const loadTokensFromLocalStorage = () => {
      const savedToken1 = localStorage.getItem('selectedToken1');     // 'From' 토큰 불러오기
      const savedToken2 = localStorage.getItem('selectedToken2');     // 'To' 토큰 불러오기
      const savedRecentTokens = localStorage.getItem('recentTokens'); // 최근 토큰 불러오기

      // 로드된 토큰이 있을 경우 상태를 업데이트합니다.
      if (savedToken1) setSelectedTokenFrom(savedToken1);
      if (savedToken2) setSelectedTokenTo(savedToken2);
      if (savedRecentTokens) setRecentTokens(JSON.parse(savedRecentTokens)); // JSON을 파싱하여 상태에 저장
    };

    loadTokensFromLocalStorage(); // 함수 호출
  }, []); // 빈 의존성 배열로 컴포넌트가 처음 마운트될 때만 실행됩니다.

  // 선택된 토큰과 최근 토큰을 로컬 스토리지에 저장합니다.
  useEffect(() => {
    localStorage.setItem('selectedToken1', selectedTokenFrom);          // 'From' 토큰 저장
    localStorage.setItem('selectedToken2', selectedTokenTo);            // 'To' 토큰 저장
    localStorage.setItem('recentTokens', JSON.stringify(recentTokens)); // 최근 토큰을 JSON 형식으로 저장
  }, [selectedTokenFrom, selectedTokenTo, recentTokens]);               // 선택된 토큰이 변경될 때마다 실행됩니다.

  // 'From' 토큰의 스왑 비율을 가져오기 위한 API 호출
  useEffect(() => {
    debouncedGetFromSwapRate(getTokenID(selectedTokenFrom)); // 선택된 'From' 토큰의 ID를 사용하여 비율을 가져옵니다.
  }, [selectedTokenFrom]); // 'From' 토큰이 변경될 때마다 실행됩니다.

  // 'To' 토큰의 스왑 비율을 가져오기 위한 API 호출
  useEffect(() => {
    debouncedGetToSwapRate(getTokenID(selectedTokenTo)); // 선택된 'To' 토큰의 ID를 사용하여 비율을 가져옵니다.
  }, [selectedTokenTo]); // 'To' 토큰이 변경될 때마다 실행됩니다.

  // 주어진 토큰 심볼로부터 토큰 ID를 반환하는 함수
  const getTokenID = (symbol: string) => {
    const token = TOKENS.find(token => token.symbol === symbol); // 심볼로 토큰 찾기
    return token ? token.id : ''; // 토큰이 있으면 ID를 반환하고, 없으면 빈 문자열 반환
  }

  const handleAlert = () => alert('준비 중입니다'); // 알림을 보여주는 함수

  // 모달을 열기 위한 함수
  const handleOpenModal = (inputNumber: 1 | 2) => {
    setSelectedTokenInput(inputNumber); // 어떤 입력 필드의 토큰을 선택하는지 설정
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => setIsModalOpen(false); // 모달 닫기 함수

  // 선택된 토큰을 설정하는 함수
  const handleTokenSelect = (token: string) => {
    if (selectedTokenInput === 1) {
      setSelectedTokenFrom(token); // 'From' 토큰 선택
    } else {
      setSelectedTokenTo(token); // 'To' 토큰 선택
    }
    updateRecentTokens(token); // 최근 토큰 업데이트
    handleCloseModal(); // 모달 닫기
  };

  // 최근 토큰 목록을 업데이트하는 함수
  const updateRecentTokens = (token: string) => {
    setRecentTokens(prev => {
      const updatedTokens = [token, ...prev.filter(t => t !== token)].slice(0, 7); // 새로운 토큰을 추가하고 중복된 토큰은 제외
      localStorage.setItem('recentTokens', JSON.stringify(updatedTokens)); // 로컬 스토리지에 저장
      return updatedTokens; // 상태 업데이트
    });
  };

  // 'From' 입력 필드의 금액 변경을 처리하는 함수
  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    setAmountFrom(value); // 'From' 금액 상태 업데이트

    if (value === '') { // 입력값이 비어있으면
      setAmountTo(''); // 'To' 금액도 비워줌
      return; // 함수 종료
    }

    if (isFromFocused) { // 'From' 필드가 포커스되어 있다면
      setAmountTo(calculateFromSwap(value)); // 스왑 계산 후 'To' 금액 업데이트
    }
  };

  // 'To' 입력 필드의 금액 변경을 처리하는 함수
  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기
    setAmountTo(value); // 'To' 금액 상태 업데이트

    if (value === '') { // 입력값이 비어있으면
      setAmountFrom(''); // 'From' 금액도 비워줌
      return; // 함수 종료
    }

    if (!isFromFocused) { // 'From' 필드가 포커스되지 않았다면
      setAmountFrom(calculateToSwap(value)); // 스왑 계산 후 'From' 금액 업데이트
    }
  };

  // 'From' 스왑 비율을 가져오는 비동기 함수 (디바운스 적용)
  const debouncedGetFromSwapRate = debounce(async (ids: string) => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=${ids}`);
      setSwapFromRate(res.data[ids]); // 스왑 비율 상태 업데이트
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        if (axiosError.response.status === 429) { // 너무 많은 요청을 한 경우
          const retryAfter = parseInt(axiosError.response.headers['retry-after'], 10) || 1; // 기본값 1초
          console.log(`Too many requests. Retrying after ${retryAfter} seconds.`);
          setTimeout(() => debouncedGetFromSwapRate(ids), retryAfter * 1000); // 재시도
        } else {
          console.error("API 호출 오류:", axiosError.response.status, axiosError.response.data); // 에러 로그 출력
        }
      } else {
        console.error("네트워크 오류:", error); // 네트워크 오류 처리
      }
    }
  }, 1000); // 1초 지연
  

  // 'To' 스왑 비율을 가져오는 비동기 함수 (디바운스 적용)
  const debouncedGetToSwapRate = debounce(async (ids: string) => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=${ids}`);
      setSwapFromRate(res.data[ids]); // 스왑 비율 상태 업데이트
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        if (axiosError.response.status === 429) { // 너무 많은 요청을 한 경우
          const retryAfter = parseInt(axiosError.response.headers['retry-after'], 10) || 1; // 기본값 1초
          console.log(`Too many requests. Retrying after ${retryAfter} seconds.`);
          setTimeout(() => debouncedGetToSwapRate(ids), retryAfter * 1000); // 재시도
        } else {
          console.error("API 호출 오류:", axiosError.response.status, axiosError.response.data); // 에러 로그 출력
        }
      } else {
        console.error("네트워크 오류:", error); // 네트워크 오류 처리
      }
    }
  }, 1000); // 1초 지연
  

  // 'From' 금액 계산
  const calculateFromSwap = (value: string) => ((parseFloat(value) * swapFromRate) / swapToRate).toFixed(10); // 스왑 비율에 따라 'To' 금액 계산
  // 'To' 금액 계산
  const calculateToSwap = (value: string) => ((parseFloat(value) * swapToRate) / swapFromRate).toFixed(10); // 스왑 비율에 따라 'From' 금액 계산

  return (
    <div className="App"> {/* 전체 앱을 감싸는 div */}
      <header className="App-header"> {/* 헤더 섹션 */}
        <div className="swap-container"> {/* 스왑 컨테이너 */}
          <SwapHeader onAlert={handleAlert} /> {/* 스왑 헤더 */}
          <TokenInput
            amount={amountFrom}                       // 'From' 금액
            onAmountChange={handleAmountFromChange}   // 금액 변경 핸들러
            isFocused={isFromFocused}                 // 포커스 상태
            setIsFocused={setIsFromFocused}           // 포커스 설정 핸들러
            selectedToken={selectedTokenFrom}         // 선택된 'From' 토큰
            onTokenSelect={() => handleOpenModal(1)}  // 모달 열기 핸들러
            tokenPrice={swapFromRate}                 // 선택된 토큰의 가격
          />
          <SwapArrow /> {/* 스왑 화살표 */}
          <TokenInput
            amount={amountTo} // 'To' 금액
            onAmountChange={handleAmountToChange}         // 금액 변경 핸들러
            isFocused={!isFromFocused}                    // 포커스 상태 (반대)
            setIsFocused={() => setIsFromFocused(false)}  // 포커스 설정 핸들러
            selectedToken={selectedTokenTo}               // 선택된 'To' 토큰
            onTokenSelect={() => handleOpenModal(2)}      // 모달 열기 핸들러
            tokenPrice={swapToRate}                       // 선택된 토큰의 가격
          />
          <SwapButton
            amountFrom={amountFrom} // 'From' 금액
            amountTo={amountTo}     // 'To' 금액
            onSwap={handleAlert}    // 스왑 핸들러
          />
        </div>
        <Footer /> {/* 하단 푸터 */}
        <Modal
          isOpen={isModalOpen}              // 모달 열림 여부
          onClose={handleCloseModal}        // 모달 닫기 핸들러
          onAlert={handleAlert}             // 알림 핸들러
          tokens={TOKENS}                   // 토큰 리스트
          searchTerm={searchTerm}           // 검색어
          setSearchTerm={setSearchTerm}     // 검색어 설정 핸들러
          recentTokens={recentTokens}       // 최근 토큰
          onTokenSelect={handleTokenSelect} // 토큰 선택 핸들러
        />
      </header>
    </div>
  );
};

export default App; // App 컴포넌트를 내보냅니다.
