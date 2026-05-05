import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Task from "./Task";
import NavBar from "./NavBar";
import { appContext } from "../App";
import Loading from "./Loading";
import "./Tasks.css";
export default function Tasks() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { userID } = useContext(appContext);
  const [sortConditionTasks, setSortConditonTasks] = useState(() => {
    return searchParams.get("sortBy") || null;
  });
  const [tasksList, setTasksList] = useState(() => {
    return JSON.parse(localStorage.getItem("tasksList")) || [];
  });
  const [newTask, setNewTask] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [title, setTitle] = useState(searchParams.get("title") || "");
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
    if (!userID) navigate("/login", { state: "this should be the url" });
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  useEffect(() => {
    if (tasksList.length == 0) {
      async function getTasks() {
        if (!userID) return;
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:3000/tasks/?userId=${userID}`
          );
          if (!response.ok)
            throw new Error(
              `status: ${response.status}\n Could not load tasks, please try again later.`
            );
          const data = await response.json();
          setTasksList(data);
        } catch (error) {
          alert(error);
          navigate('/');
        } finally {
          setTimeout(() => setLoading(false), 1000);
        }
      }
      if (tasksList.length == 0) getTasks();
    }
  }, [userID]);

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
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          `status: ${response.status}\n Could not delete this task, please try again later/`
        );
      setTasksList((prev) => prev.filter((task) => task.id !== id));
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
      const response = await fetch(`http://localhost:3000/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userID,
          title: data.title,
          completed: data.completed,
        }),
      });
      if (!response.ok)
        throw new Error(
          `status: ${response.status}\n Could not add the new task, please try again later.`
        );
      setNewTask(false);
      const newTaskResponse = await response.json();
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
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTask),
      });
      if (!response.ok)
        throw new Error(
          `status: ${response.status}\n The server could not upadate the task, try again later.`
        );
      const updatedTask = await response.json();
      setTasksList((prev) =>
        prev.map((task) => (task.id == taskId ? updatedTask : task))
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
        (a, b) => convertIdToInt(a[sortBy]) - convertIdToInt(b[sortBy])
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
    navigate(`/tasks/${userID}`);
  }
  function removeAllConditions() {
    setCondition(null);
  }
  return (
    <>
      {loading ? <Loading message={"loading Tasks..."}></Loading> : null}
      <NavBar></NavBar>
      <h1>Tasks</h1>
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
          setCheck(() => (task) => {
            return task.completed;
          });
          navigate(`?completed=true`);
        }}
      >
        only completed
      </button>
      <button
        onClick={() => {
          setCondition("uncompletedOnly");
          setCheck(() => (task) => {
            return !task.completed;
          });
          navigate(`?completed=false`);
        }}
      >
        Uncompleted only
      </button>

      <button onClick={back}>Back To All Tasks</button>

      <button onClick={() => setNewTask(!newTask)}>Add New Task</button>
      <div>
        <button
          onClick={() => {
            setCondition("byTitle");
            setCheck(() => (task) => {
              return task.title == title;
            });
            navigate(`?title=${title}`);
          }}
        >
         Search By Title
        </button>
        <input
          type="text"
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <button
          onClick={() => {
            setCondition("byId");
            setCheck(() => (task) => {
              return Number(task.id) === Number(taskID);
            });
            navigate(`?id=${taskID}`);
          }}
        >
          Search By ID
        </button>
        <input
          type="text"
          placeholder="Enter ID"
          value={taskID}
          onChange={(e) => setTaskID(e.target.value)}
        />
      </div>
      {newTask ? (
        <>
          <form onSubmit={handleSubmit(addNewTask)}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              {...register("title")}
            ></input>
            <input
              type="checkbox"
              id="completed"
              name="completed"
              {...register("completed")}
            ></input>
            <label htmlFor="completed">Completed?</label>
            <button>Add</button>
          </form>
        </>
      ) : null}
      {tasksList.length > 0 ? (
        tasksList.map((task) =>
          check(task) ? (
            <Task
              onDelete={deleteTask}
              edit={updateTask}
              id={task.id}
              key={task.id}
              title={task.title}
              completed={task.completed}
            ></Task>
          ) : null
        )
      ) : (
        <p>No Tasks</p>
      )}

      <Outlet></Outlet>
    </>
  );
}
