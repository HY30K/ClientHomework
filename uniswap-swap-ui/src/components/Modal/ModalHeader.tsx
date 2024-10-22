// 모달 헤더 컴포넌트

interface ModalHeaderProps {
    searchTerm: string; // 현재 검색어 상태
    setSearchTerm: (term: string) => void; // 검색어를 설정하는 함수
    onClose: () => void; // 모달을 닫는 함수
}

export default function ModalHeader({ searchTerm, setSearchTerm, onClose }:
    ModalHeaderProps) {
    return (
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
};
