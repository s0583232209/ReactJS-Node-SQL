import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { appContext } from "../App";

export default function Home() {
  const { setUserId } = useContext(appContext);
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || null;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setUserId(currentUser.userId);
    }
  }, [currentUser, navigate, setUserId]);

  if (!currentUser) return null;

  const uid = currentUser.userId || currentUser.id;

  return (
    <>
      <NavBar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Personal Workspace</div>
        <h1 className="hero-title">
          Welcome back,<br />{currentUser.name}.
        </h1>
        <p className="hero-subtitle">
          Your hub for posts, tasks, and collaboration — clean, fast, and always in sync.
        </p>
      </section>

      {/* Quick nav cards */}
      <div className="home-cards">
        <div className="home-card" onClick={() => navigate(`/${uid}/posts`)}>
          <div className="home-card-label">Posts</div>
          <div className="home-card-desc">Browse, create, and manage your posts and discussions</div>
        </div>
        <div className="home-card" onClick={() => navigate(`/${uid}/tasks`)}>
          <div className="home-card-label">Tasks</div>
          <div className="home-card-desc">Track progress, complete tasks, and stay organized</div>
        </div>
      </div>

      {/* Features */}
      <section className="features-section">
        <h2 className="features-heading">Everything you need</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <div className="feature-card-title">Posts</div>
            <div className="feature-card-desc">
              Create and share posts, search by title or ID, and edit your content at any time.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-number">02</div>
            <div className="feature-card-title">Tasks</div>
            <div className="feature-card-desc">
              Add tasks, mark them complete, sort by status or title, and filter to find exactly what you need.
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-number">03</div>
            <div className="feature-card-title">Comments</div>
            <div className="feature-card-desc">
              Discuss any post with comments. Edit or delete your own contributions inline.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
