import { useState, useEffect, useRef } from "react";
import Comments from "./Comments";

export default function Post(props) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(props.title);
  const [newBody, setNewBody] = useState(props.body);
  const [showComments, setShowComments] = useState(false);
  const postRef = useRef(null);
  useEffect(() => {
    setNewTitle(props.title);
    setNewBody(props.body);
    setShowComments(false); 
  }, [props.title, props.body, props.id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        props.isExpanded &&
        postRef.current &&
        !postRef.current.contains(event.target)
      ) {
        props.onCollapse && props.onCollapse();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.isExpanded, props.onCollapse]);

  function startEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    if (newTitle.trim() === "") return;
    props.edit(props.id, { title: newTitle, body: newBody });
    setEditing(false);
  }

  function toggleComments() {
    setShowComments((prev) => !prev);
  }

  return (
    <div
      ref={postRef}
      className={`post ${props.isExpanded ? "expanded-floating" : ""}`}
    >
      {editing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h3>ID: {props.id}</h3>
          <h2>{props.title}</h2>

          {props.isExpanded && <p>{props.body}</p>}

          {!props.isExpanded && props.onExpand && (
            <button onClick={props.onExpand}>Open Full Post</button>
          )}
          {props.isExpanded && props.onCollapse && (
            <button onClick={props.onCollapse}>Close Full Post</button>
          )}

          {props.currentUser && (
            <>
              <button onClick={() => props.onDelete(props.id)}>Delete</button>
              <button onClick={startEdit}>Edit</button>
            </>
          )}
          {props.isExpanded && (
            <>
              <button onClick={toggleComments}>
                {showComments ? "Hide Comments" : "Show Comments"}
              </button>
            </>
          )}
          <div className="comments-container">
            <Comments
              key={props.id}
              postId={props.id}
              showComments={showComments}
              setShowComments={setShowComments}
            />
          </div>
        </>
      )}
    </div>
  );
}
