import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Task(props) {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("current-user")) navigate("/login");

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(props.title);

  useEffect(() => {
    setNewTitle(props.title);
  }, [props.title, props.id]);

  function saveEdit() {
    if (newTitle.trim() === "") return;
    props.edit(props.id, { title: newTitle, completed: props.completed });
    setEditing(false);
  }

  return (
    <div className={`task ${props.completed ? "task-done" : ""}`}>
      {editing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="task-actions">
            <button onClick={saveEdit}>Save</button>
            <button className="btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>#{props.id}</h3>
          <span className={`task-title ${props.completed ? "task-title-completed" : ""}`}>{props.title}</span>

          <div className="task-complete-wrap">
            <input
              id={`complete-${props.id}`}
              type="checkbox"
              onChange={() => props.edit(props.id, { title: props.title, completed: !props.completed })}
              checked={props.completed}
            />
            <label htmlFor={`complete-${props.id}`}>Done</label>
          </div>

          <div className="task-actions">
            <button className="btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn-danger btn-sm" onClick={() => props.onDelete(props.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
