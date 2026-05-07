import panda404 from "../assets/panda404.png";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md)",
        padding: "3rem 2.5rem",
        maxWidth: "440px",
        width: "100%",
        textAlign: "center",
      }}>
        <img
          src={panda404}
          alt=""
          style={{ width: "170px", display: "block", margin: "0 auto 1.5rem" }}
        />

        <div style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--primary)",
          background: "var(--primary-light)",
          padding: "0.18rem 0.55rem",
          borderRadius: "var(--radius-sm)",
          display: "inline-block",
          marginBottom: "0.85rem",
        }}>404</div>

        <h1 style={{ margin: "0 0 0.6rem", fontSize: "1.6rem", letterSpacing: "-0.03em" }}>
          Page not found
        </h1>
        <p style={{ margin: "0 0 2rem", color: "var(--text-2)", fontSize: "0.9rem", lineHeight: "1.75" }}>
          Looks like this page doesn't exist. It may have been moved or the URL is incorrect.
        </p>
        <button onClick={() => navigate("/")}>← Go Home</button>
      </div>
    </div>
  );
}
