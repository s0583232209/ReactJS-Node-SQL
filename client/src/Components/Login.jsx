import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { appContext } from "../App";
import axios from "axios";
import api from "../api";

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 30 30" fill="none">
    <defs>
      <linearGradient
        id="ll"
        x1="0"
        y1="0"
        x2="30"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#95d5b2" />
        <stop offset="1" stopColor="#52b788" />
      </linearGradient>
    </defs>
    <rect width="30" height="30" rx="8" fill="url(#ll)" />
    <path
      d="M8 8v14l14-14v14"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUserId } = useContext(appContext);

  async function login(data) {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", data, {
        withCredentials: true,
      });
      const { userId, email } = response.data;
      console.log("Login successful:", response.data);

      const { name } = response.data;
      sessionStorage.setItem(
        "current-user",
        JSON.stringify({ userId, email, username, name }),
      );
      setUserId(userId);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-logo-wrap">
          <Logo />
          <span className="auth-brand-logo-name">Nexus</span>
        </div>
        <h2 className="auth-brand-headline">
          Your personal
          <br />
          workspace.
        </h2>
        <p className="auth-brand-sub">
          Posts, tasks, and collaboration — all in one clean, fast place.
        </p>
        <div className="auth-features">
          {[
            "Create and manage posts",
            "Track tasks and progress",
            "Collaborate with comments",
            "Edit your profile anytime",
          ].map((f) => (
            <div className="auth-feature" key={f}>
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <p className="auth-form-heading">Welcome back</p>
        <p className="auth-form-sub">Sign in to continue to Nexus</p>
        <form onSubmit={handleSubmit(login)}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            {...register("email")}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
          <p className="errorLog">{error}</p>
          <button type="submit">Sign In</button>
        </form>
        <p className="auth-alt-link">
          Don't have an account?
          <button type="button" onClick={() => navigate("/register")}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
