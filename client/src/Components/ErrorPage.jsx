import dinosaur404error from "../assets/dinosaur404.png";
import panda404 from "../assets/panda404.png";
import { useNavigate } from "react-router-dom";
export default function ErrorPage() {
  const navigate = useNavigate();
  return (
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
            fontSize: "6rem",
            marginBottom: "1.5rem",
            animation: "bounce 2s infinite",
          }}
        >
          <img src={panda404} width={"300px"}></img>
        </div>
        <h1
          style={{
            fontSize: "2.5rem",
            margin: "0 0 1rem 0",
            fontWeight: "bold",
            color: "#064635",
          }}
        >
          Oops! Page Not Found
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            margin: "0 0 2rem 0",
            color: "#064635",
            lineHeight: "1.5",
          }}
        >
          Looks like this page decided to take a little vacation! Don't worry,
          even the best explorers sometimes take a wrong turn.
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
          onClick={() => {
            navigate(`/`);
          }}
        >
          🏠 Go Back Home
        </button>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
