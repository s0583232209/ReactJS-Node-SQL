import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { appContext } from "../App.jsx";
import "./NavBar.css";

export default function NavBar() {
  const { userId } = useContext(appContext);
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
          onClick={() => navigate(`${userId}/Albums`)}
        >
          Albums
        </button>
        <button
          className="nav-button"
          onClick={() => navigate(`/${userId}/posts`)}
        >
          Posts
        </button>
        <button
          className="nav-button"
          onClick={() => navigate(`/${userId}/tasks`)}
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
