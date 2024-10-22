import React from 'react';

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
const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onAlert,
    tokens,
    searchTerm,
    setSearchTerm,
    recentTokens,
    onTokenSelect,
}) => {
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

// 모달 헤더 컴포넌트
const ModalHeader: React.FC<{
    searchTerm: string; // 현재 검색어 상태
    setSearchTerm: (term: string) => void; // 검색어를 설정하는 함수
    onClose: () => void; // 모달을 닫는 함수
}> = ({ searchTerm, setSearchTerm, onClose }) => (
    <div className="modal-header">

        <input
            type="text"
            placeholder="이름 검색 또는 주소 붙여 넣기" // 입력 필드에 표시될 텍스트
            value={searchTerm} // 입력된 검색어 상태
            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 변경 시 상태 업데이트
        />

        <button onClick={onClose}>X</button> {/* 모달 닫기 버튼 */}

    </div>
);

// 최근 선택한 토큰 목록 컴포넌트
const RecentTokensList: React.FC<{
    recentTokens: string[]; // 최근 선택한 토큰 목록
    onTokenSelect: (token: string) => void; // 토큰 선택 시 호출되는 함수
}> = ({ recentTokens, onTokenSelect }) => (
    <div className="recent-tokens">

        <p>최근 선택한 토큰</p>

        <div className="recent-tokens-list">
            {recentTokens.map(token => (
                <button
                    key={token}
                    onClick={() => onTokenSelect(token)}> {/* 토큰 선택 시 onTokenSelect 호출 */}
                    {token} {/* 토큰 심볼 표시 */}
                </button>
            ))}
        </div>

    </div>
);

// 필터링된 토큰 목록 컴포넌트
const TokenList: React.FC<{
    filteredTokens: { symbol: string; name: string }[]; // 필터링된 토큰 목록
    onTokenSelect: (token: string) => void; // 토큰 선택 시 호출되는 함수
}> = ({ filteredTokens, onTokenSelect }) => (
    <div className="token-list">

        {filteredTokens.map(token => (
            <div
                className="token-item" // CSS 클래스명
                key={token.symbol} // 각 토큰 항목의 고유 key는 토큰 심볼
                onClick={() => onTokenSelect(token.symbol)} // 토큰 선택 시 onTokenSelect 호출
            >

                <span>{token.symbol}</span> {/* 토큰 심볼 표시 */}
                <span>{token.name}</span> {/* 토큰 이름 표시 */}
            </div>
        ))}

    </div>
);

export default Modal; // Modal 컴포넌트를 내보냄
