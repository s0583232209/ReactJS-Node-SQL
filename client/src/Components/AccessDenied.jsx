import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export function AccessDenied() {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "calc(100vh - var(--nav-h))",
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
          <div style={{
            width: "56px",
            height: "56px",
            background: "var(--primary-light)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "1.6rem",
          }}>🔒</div>

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
          }}>403</div>

          <h1 style={{ margin: "0 0 0.6rem", fontSize: "1.6rem", letterSpacing: "-0.03em" }}>
            Access Denied
          </h1>
          <p style={{ margin: "0 0 2rem", color: "var(--text-2)", fontSize: "0.9rem", lineHeight: "1.75" }}>
            You don't have permission to view this page. Please check your account or go back home.
          </p>
          <button onClick={() => navigate("/")}>← Go Home</button>
        </div>
      </div>
    </>
  );
}
