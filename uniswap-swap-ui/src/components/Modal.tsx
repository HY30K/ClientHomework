import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAlert: () => void;
    tokens: { symbol: string; name: string }[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    recentTokens: string[];
    onTokenSelect: (token: string) => void;
}

const Modal: React.FC<ModalProps> = ({
    isOpen, onClose, onAlert,tokens, searchTerm, setSearchTerm, recentTokens, onTokenSelect
}) => {
    if (!isOpen) return null;

    const filteredTokens = tokens.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <input
                        type="text"
                        placeholder="이름 검색 또는 주소 붙여 넣기"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={onClose}>X</button>
                </div>

                {recentTokens.length > 0 ? (

                    <div className="recent-tokens">
                        <p>최근 선택한 토큰</p>
                        <div className="recent-tokens-list">
                            {recentTokens.map(token => (
                                <button key={token} onClick={() => onTokenSelect(token)}>
                                    {token}
                                </button>
                            ))}
                        </div>
                    </div>

                ) : null}

                <div className="token-list">
                    {filteredTokens.map(token => (

                        <div
                            key={token.symbol}
                            className="token-item"
                            onClick={() => onTokenSelect(token.symbol)}
                        >
                            <span>{token.symbol}</span>
                            <span>{token.name}</span>
                        </div>
                        
                    ))}
                </div>

                <button className="manage-tokens" onClick={onAlert}>
                    토큰 목록 관리
                </button>
            </div>
        </div>
    );
};

export default Modal;
