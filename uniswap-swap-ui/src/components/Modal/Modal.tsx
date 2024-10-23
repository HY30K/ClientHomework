import TokenList from '../TokenList';
import RecentTokensList from './RecentTokensList';
import ModalHeader from './ModalHeader';

// ModalProps 인터페이스 정의: 모달에 필요한 props를 정의
interface ModalProps {
    isOpen: boolean;                            // 모달이 열려 있는지 여부
    onClose: () => void;                        // 모달을 닫는 함수
    onAlert: () => void;                        // 알림을 위한 함수
    tokens: { symbol: string; name: string }[]; // 토큰 목록 배열
    searchTerm: string;                         // 검색어 상태
    setSearchTerm: (term: string) => void;      // 검색어를 설정하는 함수
    recentTokens: string[];                     // 최근 선택한 토큰 목록
    onTokenSelect: (token: string) => void;     // 토큰 선택 시 호출되는 함수
}

// Modal 컴포넌트 선언
export default function Modal ({
    isOpen,
    onClose,
    onAlert,
    tokens,
    searchTerm,
    setSearchTerm,
    recentTokens,
    onTokenSelect,
} : ModalProps) {
    
    // 모달이 열려 있지 않다면 null을 반환하여 렌더링하지 않음
    if (!isOpen) return null;

    // 필터링된 토큰 목록: 검색어를 기준으로 필터링
    const filteredTokens = tokens.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) || // 이름으로 필터링
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) // 심볼로 필터링
    );

    return (
        <div className="modal-overlay" onClick={onClose}> {/* 모달 배경 클릭 시 모달 닫기 */}
            <div className="modal-content" onClick={e => e.stopPropagation()}> {/* 모달 컨텐츠 클릭 시 이벤트 전파 방지 */}

                {/* 모달 헤더: 검색 입력 및 닫기 버튼 */}
                <ModalHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onClose={onClose}
                />

                {/* 최근 선택한 토큰 목록이 있을 경우 렌더링 */}
                {recentTokens.length > 0 ? (
                    <RecentTokensList
                        recentTokens={recentTokens}
                        onTokenSelect={onTokenSelect}
                    />
                ) : null}

                {/* 필터링된 토큰 목록 렌더링 */}
                <TokenList
                    filteredTokens={filteredTokens}
                    onTokenSelect={onTokenSelect}
                />

                {/* '토큰 목록 관리' 버튼 클릭 시 onAlert 호출 */}
                <button className="manage-tokens" onClick={onAlert}>
                    토큰 목록 관리
                </button>
            </div>
        </div>
    );
};
