import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { appContext } from "../App";
export default function Home() {
  const {setUserId}=useContext(appContext)
  const navigate = useNavigate();
  const currentUser =
    JSON.parse(sessionStorage.getItem("current-user")) || null;
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setUserId(currentUser.userId);
    }
  }, [currentUser, navigate, setUserId]);
  if (!currentUser) return null;
  return (
    <>
      <NavBar></NavBar>
      <h1>🦋Home</h1>
      <h2>Welcome, {currentUser.name}!</h2>
      <button className="showInfo" onClick={() => setShowInfo(!showInfo)}>
        Info
      </button>

      {showInfo ? (
        <>
          <h3>Name: {currentUser.name}</h3>
          <h3>Username: {currentUser.username}</h3>
          <h3>Email: {currentUser.email}</h3>
          <h3>Street: {currentUser.address.street}</h3>
          <h3>City: {currentUser.address.city}</h3>
          <h3>Phone Number: {currentUser.phone}</h3>
        </>
      ) : null}
    </>
  );
}
