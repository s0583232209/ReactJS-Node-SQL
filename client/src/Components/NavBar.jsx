import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const currentUser =
    JSON.parse(sessionStorage.getItem("current-user")) || null;
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  function logOut() {
    localStorage.clear();
    sessionStorage.removeItem("current-user");
    navigate("/login");
  }
  return (
    <nav className="navbar">
      <div className="nav-links">
        <button
          className="nav-button"
          onClick={() => navigate(`/Albums/${currentUser.id}`)}
        >
          Albums
        </button>
        <button
          className="nav-button"
          onClick={() => navigate(`/Posts/${currentUser.id}`)}
        >
          Posts
        </button>
        <button
          className="nav-button"
          onClick={() => navigate(`/Tasks/${currentUser.id}`)}
        >
          Tasks
        </button>
      </div>
      <button className="nav-button logout-button" onClick={logOut}>
        Log Out
      </button>
    </nav>
  );
}
