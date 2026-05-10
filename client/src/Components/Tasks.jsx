import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
import NavBar from "./NavBar";
import { appContext } from "../App";
import Loading from "./Loading";
import "./Tasks.css";
import api from "../api";
export default function Tasks() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  console.log(params.userId, "userId from params in tasks");
  const { userId } = useContext(appContext);
  console.log(userId == params.userId, "userId in tasks");
  const [sortConditionTasks, setSortConditonTasks] = useState(() => {
    return searchParams.get("sortBy") || null;
  });
  const [tasksList, setTasksList] = useState(() => {
    return JSON.parse(localStorage.getItem("tasksList")) || [];
  });
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [titleInput, setTitleInput] = useState("");
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [idInput, setIdInput] = useState("");
  const [taskID, setTaskID] = useState(searchParams.get("id") || "");
  const [check, setCheck] = useState(() => () => {
    return true;
  });
  const [condition, setCondition] = useState();
  useEffect(() => {
    if (searchParams.get("id")) {
      setCondition("byId");
      setTaskID(searchParams.get("id"));
    } else if (searchParams.get("title")) {
      setCondition("byTitle");
      setTitle(searchParams.get("title"));
    } else if (searchParams.get("completed") === "true") {
      setCondition("completedOnly");
    } else if (searchParams.get("completed") === "false") {
      setCondition("uncompletedOnly");
    } else {
      setCondition(null);
    }
  }, [searchParams]);
  useEffect(() => {
    if (!userId) {
      navigate("/login", { state: "this should be the url" });
      return;
    }
    if (params.userId && params.userId != userId) {
      navigate("/access_denied");
    }
  }, [userId, params.userId, navigate]);
  useEffect(() => {
    if (tasksList.length == 0) {
      async function getTasks() {
        if (!userId) return;
        setLoading(true);
        try {
          const response = await api.get(`/api/${userId}/tasks`);
          const data = response.data;
          setTasksList(data);
        } catch (error) {
          alert(error);
          navigate("/");
        } finally {
          setTimeout(() => setLoading(false), 1000);
        }
      }
      if (tasksList.length == 0) getTasks();
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    return () => {
      localStorage.removeItem("tasksList");
    };
  }, [tasksList]);
  useEffect(() => {
    if (condition)
      localStorage.setItem("conditionTasks", JSON.stringify(condition));
    else localStorage.removeItem("conditionTasks");
  }, [condition]);

  useEffect(() => {
    if (tasksList.length == 0) return;
    switch (condition) {
      case "byId":
      case "Id":
        console.log(taskID);

        setCheck(() => (task) => {
          return task.id == taskID;
        });
        break;
      case "completedOnly":
        setCheck(() => (task) => {
          return task.completed;
        });
        break;
      case "uncompletedOnly":
        setCheck(() => (task) => {
          return !task.completed;
        });
        break;
      case "byTitle":
      case "title":
        setCheck(() => (task) => {
          return task.title.trim() == title.trim();
        });
        break;
      default:
        setCheck(() => () => {
          return true;
        });
        break;
    }
    return;
  }, [condition, title, taskID, tasksList]);
  useEffect(() => {
    switch (sortConditionTasks) {
      case "title":
        sortList("title");
        break;
      case "id":
        sortList("id");
        break;
      case "true":
        sortList("true");
        break;
      case "false":
        sortList("false");
        break;
    }
    return () => {
      localStorage.removeItem("sortConditionTask");
    };
  }, [sortConditionTasks]);
  async function deleteTask(id) {
    try {
      setLoading(true);
      if (window.confirm("Are you sure?"));
      {
        await api.delete(`/api/${userId}/tasks/${id}`);
        setTasksList((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  async function addNewTask(data) {
    if (data.title.trim() === "") {
      setNewTask(false);
      return;
    }
    try {
      setLoading(true);
      const response = await api.post(`/api/${userId}/tasks`, {
        userId: userId,
        title: data.title,
        completed: data.completed,
      });
      setNewTask(false);
      const newTaskResponse = response.data;
      setTasksList((prev) => [...prev, newTaskResponse]);
      reset();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  async function updateTask(taskId, edits) {
    const taskToEdit = tasksList.find((t) => t.id == taskId);
    const editedTask = { ...taskToEdit, ...edits };
    try {
      setLoading(true);
      const response = await api.put(
        `/api/${userId}/tasks/${taskId}`,
        editedTask,
      );
      const updatedTask = response.data;
      setTasksList((prev) =>
        prev.map((task) => (task.id == taskId ? updatedTask : task)),
      );
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  function sortList(sortBy) {
    if (!sortBy) return;
    if (sortBy == "sort") return;
    if (sortBy == "true" || sortBy == "false") {
      sortByCompleted(sortBy);
      return;
    }
    if (sortBy == "id")
      tasksList.sort(
        (a, b) => convertIdToInt(a[sortBy]) - convertIdToInt(b[sortBy]),
      );
    else tasksList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    setTasksList([...tasksList]);
    navigate(`?sortBy=${sortBy}`);
  }
  function convertIdToInt(id) {
    if (typeof id === "number") return id;
    if (typeof id === "string" && id.startsWith("0x")) {
      return parseInt(id, 16);
    }
    return Number(id);
  }
  function sortByCompleted(startWith) {
    if (startWith == "false")
      tasksList.sort((a, b) => a.completed - b.completed);
    else tasksList.sort((a, b) => b.completed - a.completed);
    setTasksList([...tasksList]);
    navigate(`?sortBy=${startWith}`);
  }
  function back() {
    setCheck(() => () => {
      return true;
    });
    removeAllConditions();
    navigate(`/${userId}/tasks`);
  }
  function removeAllConditions() {
    setCondition(null);
  }
  return (
    <>
      {loading ? <Loading message={"loading Tasks..."}></Loading> : null}
      <NavBar></NavBar>
      <h1>Tasks</h1>
      <div className="filters">
        <select onChange={(e) => sortList(e.target.value)}>
          <option value="sort">Sort By</option>
          <option value="title">Title</option>
          <option value="id">ID</option>
          <option value="true">Completed First</option>
          <option value="false">Uncompleted First</option>
        </select>

        <button
          onClick={() => {
            setCondition("completedOnly");
            setCheck(() => (task) => task.completed);
            navigate(`?completed=true`);
          }}
        >
          Completed
        </button>
        <button
          onClick={() => {
            setCondition("uncompletedOnly");
            setCheck(() => (task) => !task.completed);
            navigate(`?completed=false`);
          }}
        >
          Uncompleted
        </button>
        <button onClick={back}>All Tasks</button>
        <button onClick={() => setNewTask(!newTask)}>Add New Task</button>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search by title"
            onChange={(e) => setTitleInput(e.target.value)}
            value={titleInput}
          />
          <button
            onClick={() => {
              setTitle(titleInput);
              setCondition("byTitle");
              navigate(`?title=${titleInput}`);
              setTitleInput("");
            }}
          >
            Search
          </button>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search by ID"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
          />
          <button
            onClick={() => {
              setTaskID(idInput);
              setCondition("byId");
              navigate(`?id=${idInput}`);
              setIdInput("");
            }}
          >
            Search
          </button>
        </div>
      </div>
      {newTask ? (
        <div className="add-new-post">
          <form onSubmit={handleSubmit(addNewTask)}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" {...register("title")} />
            <input
              type="checkbox"
              id="completed"
              name="completed"
              {...register("completed")}
            />
            <label htmlFor="completed">Mark as completed</label>
            <button>Add</button>
          </form>
        </div>
      ) : null}
      <div className="posts-list">
        {tasksList.length === 0 ? (
          <p>No Tasks</p>
        ) : (
          (() => {
            const filtered = tasksList.filter(check);
            if (filtered.length === 0 && condition) {
              const msg =
                condition === "byId"
                  ? `No task found with ID ${taskID}.`
                  : condition === "byTitle"
                    ? `No task found with title "${title}".`
                    : condition === "completedOnly"
                      ? "No completed tasks."
                      : condition === "uncompletedOnly"
                        ? "No uncompleted tasks."
                        : "No tasks found.";
              return <p>{msg}</p>;
            }
            return filtered.map((task) => (
              <Task
                onDelete={deleteTask}
                edit={updateTask}
                id={task.id}
                key={task.id}
                title={task.title}
                completed={task.completed}
              />
            ));
          })()
        )}
      </div>

      <Outlet></Outlet>
    </>
  );
}
