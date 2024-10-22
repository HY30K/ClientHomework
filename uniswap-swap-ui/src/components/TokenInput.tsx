import React, { useState, useEffect } from 'react'; // React 및 필요한 hooks(useState, useEffect)를 가져옴

// TokenInput 컴포넌트가 받을 props의 타입을 정의
interface TokenInputProps {
  amount: string;                                                   // 입력된 금액
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 금액이 변경될 때 실행되는 함수
  isFocused: boolean;                                               // 해당 입력 필드가 포커스 되었는지 여부
  setIsFocused: (focused: boolean) => void;                         // 포커스 상태를 변경하는 함수
  selectedToken: string;                                            // 선택된 토큰 심볼
  onTokenSelect: () => void;                                        // 토큰 선택 버튼을 눌렀을 때 호출되는 함수
}

// TokenInput 컴포넌트 선언, props를 TokenInputProps 타입으로 받음
const TokenInput: React.FC<TokenInputProps> = ({
  amount,            // 현재 금액
  onAmountChange,    // 금액 변경 핸들러
  isFocused,         // 입력 필드가 포커스 상태인지 여부
  setIsFocused,      // 포커스 상태를 변경하는 함수
  selectedToken,     // 선택된 토큰 심볼
  onTokenSelect,     // 토큰 선택 버튼 클릭 시 호출될 함수
}) => {

  // storedToken 상태: localStorage에서 관리되는 토큰을 저장하는 state. 기본값은 selectedToken
  const [storedToken, setStoredToken] = useState<string>(selectedToken);

  // 컴포넌트가 처음 렌더링될 때 localStorage에서 저장된 토큰을 가져와 storedToken을 설정
  useEffect(() => {
    const savedToken = localStorage.getItem('storedToken'); // localStorage에서 'storedToken' 키로 저장된 값 가져옴
    if (savedToken) {
      setStoredToken(savedToken); // 저장된 토큰이 있을 경우 storedToken 상태에 반영
    }
  }, []); // 빈 의존성 배열이므로 컴포넌트가 처음 마운트될 때 한 번만 실행됨

  // storedToken이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (storedToken) {
      localStorage.setItem('storedToken', storedToken); // storedToken을 localStorage에 저장
    }
  }, [storedToken]); // storedToken 값이 변경될 때마다 이 effect 실행

  return (
    // 금액 입력 및 토큰 선택 버튼을 렌더링하는 컴포넌트 구조
    <div className="input-group">
      
      {/* 금액 입력 필드 */}
      <input
        className="input"                  // 스타일을 위한 클래스 이름
        type="number"                      // 숫자 입력 필드
        placeholder="0.0"                  // 기본 표시 텍스트
        value={amount}                     // 입력된 금액을 표시
        onChange={onAmountChange}          // 금액이 변경되면 onAmountChange 호출
        onFocus={() => setIsFocused(true)} // 입력 필드가 포커스될 때 setIsFocused(true) 호출
        step="0.0000000001"                // 입력 가능 최소 단위
      />

      {/* 선택된 토큰을 표시하고, 클릭 시 토큰 선택 모달을 여는 버튼 */}
      <button className="token-select" onClick={onTokenSelect}>
        {selectedToken} {/* 현재 선택된 또는 저장된 토큰을 표시*/}
      </button>

      
    </div>
  );
};

// 컴포넌트를 외부에서 사용할 수 있도록 내보내기
export default TokenInput;
