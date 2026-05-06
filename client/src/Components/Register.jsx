import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { appContext } from "../App";
import api from "../api";
export default function Register() {
  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
  }, []);
  const { setUserId } = useContext(appContext);
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState(null);
  async function submitStep1(data) {
    console.log(data);
    if (data.password !== data.verifyPassword) {
      return;
    }

    try {
      const response = await api.post("/api/users/signup", data);
      console.log(response);

      const user = response.data;
      if (!user) {
        throw new Error("This user name isn't valid, please try another one");
      }
      sessionStorage.setItem("current-user", JSON.stringify(user));
      setUserId(user.userId);
      navigate("/");
    } catch (error) {
      setError(String(error));
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitStep1)}>
        <label htmlFor="username">User Name</label>
        <input
          type="text"
          name="username"
          id="username"
          {...register("username")}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          {...register("password")}
        />
        <label htmlFor="verifyPassword">Verify Password</label>
        <input
          type="password"
          name="verifyPassword"
          id="verifyPassword"
          {...register("verifyPassword")}
        />
        <p className="errorLog">{error}</p>

        {/* <button>Next</button> */}

        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" {...register("name")} />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" {...register("email")} />
        <label htmlFor="street">Street</label>
        <input type="text" name="street" id="street" {...register("street")} />
        <label htmlFor="city">City</label>
        <input type="text" name="city" id="city" {...register("city")} />
        <label htmlFor="zipcode">Zip code</label>
        <input
          type="number"
          name="zipcode"
          id="zipcode"
          {...register("zipcode")}
        />
        <label htmlFor="houseNumber">House Number</label>
        <input
          type="number"
          name="houseNumber"
          id="houseNumber"
          {...register("houseNumber")}
        />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          {...register("phoneNumber")}
        />
        <button onClick={handleSubmit(submitStep1)}>Register</button>
        {/* </form> */}
        {/* )} */}
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </form>
    </>
  );
}
