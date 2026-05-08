import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { appContext } from "../App";
import api from "../api";
import { useState } from "react";

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 30 30" fill="none">
    <defs>
      <linearGradient id="rl" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#95d5b2" /><stop offset="1" stopColor="#52b788" />
      </linearGradient>
    </defs>
    <rect width="30" height="30" rx="8" fill="url(#rl)" />
    <path d="M8 8v14l14-14v14" stroke="white" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function Register() {
  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  const { setUserId } = useContext(appContext);
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  async function submitStep1(data) {
    if (data.password !== data.verifyPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await api.post("/api/auth/signup", data);
      const user = response.data;
      if (!user) throw new Error("This user name isn't valid, please try another one");
      const userId = user.userId || user.id;
      sessionStorage.setItem("current-user", JSON.stringify({ userId, email: user.email, name: user.name }));
      setUserId(userId);
      navigate("/");
    } catch (err) {
      setError(String(err));
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
        <h2 className="auth-brand-headline">Join Nexus<br />today.</h2>
        <p className="auth-brand-sub">
          Create your account and start managing your work in one clean, powerful place.
        </p>
        <div className="auth-features">
          {["Personal workspace", "Manage posts & tasks", "Track your progress", "Edit your profile anytime"].map(f => (
            <div className="auth-feature" key={f}>
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel auth-form-panel--scroll">
        <p className="auth-form-heading">Create account</p>
        <p className="auth-form-sub">Fill in your details below to get started</p>
        <form onSubmit={handleSubmit(submitStep1)}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" autoComplete="username" {...register("username")} />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" autoComplete="new-password" {...register("password")} />

          <label htmlFor="verifyPassword">Confirm Password</label>
          <input type="password" id="verifyPassword" autoComplete="new-password" {...register("verifyPassword")} />

          <div className="auth-form-divider" />

          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" autoComplete="name" {...register("name")} />

          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" autoComplete="email" {...register("email")} />

          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="text" id="phoneNumber" autoComplete="tel" {...register("phoneNumber")} />

          <label htmlFor="street">Street</label>
          <input type="text" id="street" autoComplete="street-address" {...register("street")} />

          <label htmlFor="city">City</label>
          <input type="text" id="city" autoComplete="address-level2" {...register("city")} />

          <label htmlFor="zipcode">Zip Code</label>
          <input type="number" id="zipcode" autoComplete="postal-code" {...register("zipcode")} />

          <label htmlFor="houseNumber">House Number</label>
          <input type="number" id="houseNumber" {...register("houseNumber")} />

          <p className="errorLog">{error}</p>
          <button type="submit">Create Account</button>
        </form>
        <p className="auth-alt-link">
          Already have an account?
          <button type="button" onClick={() => navigate("/login")}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
