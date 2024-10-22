// 필터링된 토큰 목록 컴포넌트
interface TokenListProps {
    filteredTokens: { symbol: string; name: string }[]; // 필터링된 토큰 목록
    onTokenSelect: (token: string) => void; // 토큰 선택 시 호출되는 함수
}

export default function TokenList({ filteredTokens, onTokenSelect }:
    TokenListProps) {
    return (
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
}
