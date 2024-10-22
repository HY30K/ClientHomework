interface SwapHeaderProps {
  onAlert: () => void;
}

export default function SwapHeader({ onAlert }: SwapHeaderProps) {
  return (
    <div className="swap-header">
    <h3>스왑</h3>
    <button className="settings-button" onClick={onAlert}>⚙️</button>
  </div>
  );
};
