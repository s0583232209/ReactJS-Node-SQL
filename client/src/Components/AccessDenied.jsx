import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
export function AccessDenied() {
  const navigate = useNavigate();
  return (
    <>
      <NavBar></NavBar>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e0f7fa",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#064635",
            padding: "3rem",
            borderRadius: "20px",
            backgroundColor: "#d0f0e0",
            border: "2px solid #80cfa9",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              fontSize: "5rem",
              marginBottom: "1.5rem",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🔒
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              margin: "0 0 1rem 0",
              fontWeight: "bold",
              color: "#064635",
            }}
          >
            Access Denied
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              margin: "0 0 2rem 0",
              color: "#064635",
              lineHeight: "1.5",
            }}
          >
            Sorry, you don't have permission to access this resource. Please
            contact an administrator if you believe this is an error.
          </p>
          <button
            style={{
              backgroundColor: "#a8dadc",
              color: "#064635",
              border: "none",
              borderRadius: "6px",
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#90c9d0";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#a8dadc";
              e.target.style.transform = "translateY(0)";
            }}
            onClick={() => navigate("/")}
          >
            ← Go Back
          </button>
        </div>
        <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      </div>
    </>
  );
}
