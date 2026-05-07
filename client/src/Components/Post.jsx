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
      if (props.isExpanded && postRef.current && !postRef.current.contains(event.target)) {
        props.onCollapse && props.onCollapse();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [props.isExpanded, props.onCollapse]);

  function saveEdit() {
    if (newTitle.trim() === "") return;
    props.edit(props.id, { title: newTitle, body: newBody });
    setEditing(false);
  }

  return (
    <div ref={postRef} className={`post ${props.isExpanded ? "expanded-floating" : ""}`}>
      {editing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            value={newBody}
            onChange={e => setNewBody(e.target.value)}
          />
          <div className="post-actions">
            <button onClick={saveEdit}>Save</button>
            <button className="btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="post-meta">
            <span className="post-id-badge">#{props.id}</span>
          </div>
          <h2>{props.title}</h2>
          {props.isExpanded && <p>{props.body}</p>}

          <div className="post-actions">
            {!props.isExpanded && props.onExpand && (
              <button className="btn-ghost btn-sm" onClick={props.onExpand}>Open Post</button>
            )}
            {props.isExpanded && props.onCollapse && (
              <button className="btn-ghost btn-sm" onClick={props.onCollapse}>Close</button>
            )}
            {props.currentUser && (
              <>
                <button className="btn-danger btn-sm" onClick={() => props.onDelete(props.id)}>Delete</button>
                <button className="btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit</button>
              </>
            )}
            {props.isExpanded && (
              <button className="btn-ghost btn-sm" onClick={() => setShowComments(p => !p)}>
                {showComments ? "Hide Comments" : "Comments"}
              </button>
            )}
          </div>

          <div className="comments-container">
            <Comments
              key={props.id}
              postId={props.id}
              showComments={showComments}
              setShowComments={setShowComments}
              isExpanded={props.isExpanded}
            />
          </div>
        </>
      )}
    </div>
  );
}
