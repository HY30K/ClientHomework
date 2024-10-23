// SwapButtonProps 인터페이스 정의: SwapButton 컴포넌트에 필요한 props 타입 정의
interface SwapButtonProps {
  amountFrom: string; // 스왑할 첫 번째 토큰의 금액 (사용자가 입력한 값)
  amountTo: string;   // 스왑할 두 번째 토큰의 금액 (계산된 값 또는 입력한 값)
  onSwap: () => void; // 스왑 버튼을 눌렀을 때 실행할 함수 (클릭 이벤트 핸들러)
}

// SwapButton 컴포넌트 선언: SwapButtonProps 타입의 props를 받음
export default function SwapButton ({
  amountFrom,
  amountTo,
  onSwap
} : SwapButtonProps) {
  // 버튼의 활성화 상태를 결정하는 변수
  const isEnabled = Boolean(amountFrom && amountTo); // amountFrom과 amountTo가 모두 존재하면 true

  return (
    // 버튼 요소: 클래스와 비활성화 상태를 동적으로 적용
    <button
      // 클래스 이름을 조건부로 설정: 버튼이 활성화되면 'enabled' 클래스를 추가
      className={`swap-button ${isEnabled ? 'enabled' : ''}`}

      // 버튼 클릭 시 onSwap 함수 호출
      onClick={isEnabled ? onSwap : undefined} // 버튼이 비활성화된 경우 클릭 이벤트 무시

      // 금액이 입력되지 않은 경우 버튼 비활성화 (disabled)
      disabled={!isEnabled}
    >
      {/* 금액이 입력되었는지 여부에 따라 버튼 텍스트를 동적으로 표시 */}
      {isEnabled ? '스왑' : '금액을 입력하세요'}
    </button>
  );
};
