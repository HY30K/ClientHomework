// 최근 선택한 토큰 목록 컴포넌트
interface RecentTokensListProps {
    recentTokens: string[]; // 최근 선택한 토큰 목록
    onTokenSelect: (token: string) => void; // 토큰 선택 시 호출되는 함수
}

export default function RecentTokensList({ recentTokens, onTokenSelect }:
    RecentTokensListProps) {
    return (
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
}
