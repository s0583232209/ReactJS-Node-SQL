import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState, useRef } from "react";
import { appContext } from "../App.jsx";
import InfoPopup from "./InfoPopup.jsx";
import "./NavBar.css";

export default function NavBar() {
  const { userId } = useContext(appContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showInfo,    setShowInfo]    = useState(false);
  const profileRef = useRef(null);
  const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || null;

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  useEffect(() => {
    function handleOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showProfile]);

  function logOut() {
    localStorage.clear();
    sessionStorage.removeItem("current-user");
    navigate("/login");
  }

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <nav className="navbar">
      <div className="navbar-inner">
        {/* Left: logo + links */}
        <div className="nav-left">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#95d5b2" />
                  <stop offset="1" stopColor="#52b788" />
                </linearGradient>
              </defs>
              <rect width="30" height="30" rx="8" fill="url(#logo-grad)" />
              <path d="M8 8v14l14-14v14" stroke="white" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="nav-logo-name">Nexus</span>
          </div>

          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate("/")}>Home</button>
            <button className="nav-link" onClick={() => navigate(`/${userId}/posts`)}>Posts</button>
            <button className="nav-link" onClick={() => navigate(`/${userId}/tasks`)}>Tasks</button>
          </div>
        </div>

        {/* Right: info + avatar */}
        <div className="nav-right">
          <button className="nav-info-btn" onClick={() => setShowInfo(true)}>
            Info
          </button>

          <div className="nav-profile" ref={profileRef}>
            <button className="nav-avatar" onClick={() => setShowProfile(p => !p)} title={currentUser?.name}>
              {initials}
            </button>
            {showProfile && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-card-avatar">{initials}</div>
                  <div>
                    <div className="profile-card-name">{currentUser?.name}</div>
                    <div className="profile-card-email">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="profile-card-footer">
                  <button className="profile-card-signout" onClick={logOut}>Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </nav>

      {showInfo && <InfoPopup onClose={() => setShowInfo(false)} />}
    </>
  );
}
