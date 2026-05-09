import { useState, createContext } from "react";
import "./App.css";
import "./index.css";
import ErrorPage from "./Components/ErrorPage.jsx";
import Home from "./Components/Home.jsx";
import Login from "./Components/Login.jsx";
import Post from "./Components/Post.jsx";
import Posts from "./Components/Posts.jsx";
import Register from "./Components/Register.jsx";
import Task from "./Components/Task.jsx";
import Tasks from "./Components/Tasks.jsx";
import { AccessDenied } from "./Components/AccessDenied.jsx";
import { Routes, Route } from "react-router-dom";
export const appContext = createContext();
function App() {
  const storedUser = JSON.parse(sessionStorage.getItem("current-user"));
  console.log("App.jsx - stored user:", storedUser);
  console.log("App.jsx - userId from stored user:", storedUser?.userId);
  const [userId, setUserId] = useState(storedUser?.userId || null);
  return (
    <appContext.Provider value={{ userId, setUserId }}>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:userId/posts" element={<Posts />}>
          <Route path=":id" element={<Post />}></Route>
        </Route>
        <Route path="/:userId/tasks" element={<Tasks />}>
          <Route path=":id" element={<Task />} />
        </Route>
        <Route path="/access_denied" element={<AccessDenied />}></Route>
        <Route path="/access-denied" element={<AccessDenied />}></Route>
        <Route path="/not-found" element={<ErrorPage />}></Route>
        <Route path="/404" element={<ErrorPage />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </appContext.Provider>
  );
}

export default App;
