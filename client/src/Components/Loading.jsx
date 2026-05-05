export default function Loading({ message }) {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes butterfly {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        .animate-butterfly {
          animation: butterfly 2s ease-in-out infinite;
        }
      `}</style>

      <div
        className="fixed bottom-4 right-4 z-[9999]"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9999,
        }}
      >
        <div 
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin flex items-center justify-center"
          style={{
            width: "64px",
            height: "64px",
            border: "4px solid #14b8a6",
            borderTop: "4px solid transparent",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="animate-butterfly" style={{ fontSize: "24px" }}>🦋</div>
        </div>
      </div>
    </>
  );
}
