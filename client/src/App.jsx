import { useState, createContext } from "react";
import "./App.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import ErrorPage from "../src/Components/ErrorPage.jsx";
import Album from "../src/Components/Album.jsx";
import Albums from "../src/Components/Albums.jsx";
import Home from "../src/Components/Home.jsx";
import Login from "../src/Components/Login.jsx";
import Post from "../src/Components/Post.jsx";
import Posts from "../src/Components/Posts.jsx";
import Register from "../src/Components/Register.jsx";
import Task from "../src/Components/Task.jsx";
import Tasks from "../src/Components/Tasks.jsx";
import { AccessDenied } from "./Components/AccessDenied.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
export const appContext = createContext();
function App() {
  const [userID, setUserID] = useState(
    JSON.parse(sessionStorage.getItem("current-user"))?.userId || null
  );
  return (
    <appContext.Provider value={{ userID, setUserID }}>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/albums/:id/" element={<Albums />}></Route>
        <Route path="/albums/:id/:id" element={<Album />}></Route>
        <Route path="/posts/:id/" element={<Posts />}>
          <Route path=":id" element={<Post />}></Route>
        </Route>
        <Route path="/tasks/:id/" element={<Tasks />}>
          <Route path=":id" element={<Task />} />
        </Route>
        <Route path="/access_denied" element={<AccessDenied />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </appContext.Provider>
  );
}

export default App;
