

interface SidebarProps {
  node: any | null;
  position: { x: number; y: number } | null;
  onClose: () => void;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x + 20,
    top: position.y,
    background: '#fff',
    border: '1px solid #ccc',
    padding: '8px',
    zIndex: 1000,
    width: 200,
  };
  return (
    <div style={style}>
    </div>
  );
}
