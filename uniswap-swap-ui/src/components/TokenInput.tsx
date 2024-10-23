import React, { useState, useEffect } from 'react'; // React 및 필요한 hooks(useState, useEffect)를 가져옴

// TokenInput 컴포넌트의 props 타입을 정의합니다.
interface TokenInputProps {
  amount: string;                                                   // 입력 금액
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 금액 변경 핸들러
  isFocused: boolean;                                               // 입력 필드의 포커스 상태
  setIsFocused: (focused: boolean) => void;                         // 포커스 상태를 설정하는 핸들러
  selectedToken: string;                                            // 선택된 토큰의 심볼
  onTokenSelect: () => void;                                        // 토큰 선택 핸들러
  tokenPrice: number;                                               // 선택된 토큰의 가격
}

// TokenInput 컴포넌트를 정의합니다.
export default function TokenInput({
  amount,         // 입력된 금액
  onAmountChange, // 금액 변경 핸들러
  isFocused,      // 포커스 상태
  setIsFocused,   // 포커스 설정 핸들러
  selectedToken,  // 선택된 토큰
  onTokenSelect,  // 토큰 선택 핸들러
  tokenPrice,     // 선택된 토큰의 가격
}: TokenInputProps) {
  const [storedToken, setStoredToken] = useState<string>(selectedToken); // 상태 변수를 사용하여 저장된 토큰을 관리합니다.

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 저장된 토큰을 불러옵니다.
  useEffect(() => {
    const savedToken = localStorage.getItem('storedToken'); // 로컬 스토리지에서 저장된 토큰 가져오기
    if (savedToken) { // 저장된 토큰이 존재할 경우
      setStoredToken(savedToken); // 상태 업데이트
    }
  }, []); // 빈 의존성 배열로 인해 컴포넌트가 처음 마운트될 때만 실행됩니다.

  // 저장된 토큰이 변경될 때 로컬 스토리지에 저장합니다.
  useEffect(() => {
    if (storedToken) { // 저장된 토큰이 있을 경우
      localStorage.setItem('storedToken', storedToken); // 로컬 스토리지에 저장
    }
  }, [storedToken]); // storedToken이 변경될 때마다 실행됩니다.

  return (
    <div className="input-group"> {/* 입력 필드와 버튼을 감싸는 div */}
      <input
        className="input"                   // CSS 클래스 이름
        type="number"                       // 숫자 입력 필드
        placeholder="0.0"                   // 기본 플레이스홀더 텍스트
        value={amount}                      // 입력 필드의 값
        onChange={onAmountChange}           // 금액 변경 핸들러
        onFocus={() => setIsFocused(true)}  // 포커스 상태를 true로 설정
        step="0.0000000001"                 // 입력 단계 설정
      />
      <button className="token-select" onClick={onTokenSelect}> {/* 토큰 선택 버튼 */}
        {selectedToken} {/* 선택된 토큰의 심볼 */}
      </button>
      {/* 선택된 토큰의 USD 가격 표시 */}
      {/* <div className="token-price"> 
        {tokenPrice ? `$${tokenPrice.toFixed(2)}` : '가격 정보 없음'} {/* 가격이 있을 경우 표시 오류로 인해 주석처리}
      </div> */}
    </div>
  );
};

