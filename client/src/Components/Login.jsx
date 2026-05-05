import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { appContext } from "../App";
export default function Login() {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(null);
  const navigation = useNavigate();
  const { setUserId } = useContext(appContext);
  async function login(data) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      const user = await response.json();
      console.log("Login response:", user);
      console.log("userId from response:", user.userId);
      sessionStorage.setItem("current-user", JSON.stringify(user));
      setUserId(user.userId);
      console.log("sessionStorage after setItem:", sessionStorage.getItem("current-user"));

      navigation("/");
    } catch (error) {
      setError(String(error));
    }
  }
  // useEffect(() => {
  //   sessionStorage.clear();
  //   localStorage.clear();
  // }, []);

  return (
    <>
      <form onSubmit={handleSubmit(login)}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" {...register("email")} />
        {/* <label htmlFor="userName">User Name</label>
      <input
        type="text"
        name="userName"
        id="userName"
        {...register("userName")}
      /> */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          {...register("password")}
        />
        <p className="errorLog">{error}</p>
        <button>Log In</button>
      </form>
      <button
        onClick={() => {
          navigation("/register");
        }}
      >
        Register
      </button>
    </>
  );
}
