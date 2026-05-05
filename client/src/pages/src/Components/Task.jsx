import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Task(props) {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("current-user"))
    navigate("/login");
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(props.title);

  useEffect(() => {
    setNewTitle(props.title);
  }, [props.title, props.id]);

  function startEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    if (newTitle.trim() === "") return;
    props.edit(props.id, { title: newTitle, completed: props.completed });
    setEditing(false);
  }

  return (
    <div className="task">
      {editing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h3>ID: {props.id}</h3>
          <h2 className={`task-title ${props.completed ? "task-title-completed" : ""}`}>{props.title}</h2>

          <div>
            <input
              id={`complete-${props.id}`}
              type="checkbox"
              onChange={() =>
                props.edit(props.id, {
                  title: props.title,
                  completed: !props.completed,
                })
              }
              checked={props.completed}
            />
            <label htmlFor={`complete-${props.id}`}>Complete</label>
          </div>

          <button onClick={() => props.onDelete(props.id)}>Delete</button>
          <button onClick={startEdit}>Edit</button>
        </>
      )}
    </div>
  );
}
