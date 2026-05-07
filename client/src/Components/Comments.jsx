import { Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Comment from "./Comment";
import { appContext } from "../App";
import api from "../api";
export default function Comments(props) {
  const { userId } = useContext(appContext);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const userEmail =
    JSON.parse(sessionStorage.getItem("current-user")).email || "null";
  useEffect(() => {
    setCommentsList([]);
  }, [props.postId]);

  useEffect(() => {
    async function getComments() {
      const response = await api.get(`/api/${userId}/comments?postId=${props.postId}`);
      setCommentsList(response.data);
    }
    getComments();
  }, [props.postId]);
  async function deleteComment(id) {
    await api.delete(`/api/${userId}/comments/${id}`);
    setCommentsList((prev) => prev.filter((comment) => comment.id !== id));
  }
  async function addNewComment(data) {
    if (data.name.trim() === "") {
      setNewComment(false);
      return;
    }
    const response = await api.post(`/api/${userId}/comments`, {
      postId: props.postId,
      name: data.name,
      email: userEmail,
      body: data.body,
    });
    setNewComment(false);
    const newCommentResponse = response.data;
    console.log(newCommentResponse);
    console.log(commentsList[0]);
    setCommentsList((prev) => [...prev, newCommentResponse]);
    reset();
  }
  async function updateComment(commentId, updates) {
    const commentToEdit = commentsList.find((p) => p.id === commentId);
    const editedComment = { ...commentToEdit, ...updates };
    const response = await api.put(`/api/${userId}/comments/${commentId}`, editedComment);
    const updatedComment = response.data;
    setCommentsList((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? updatedComment : comment,
      ),
    );
  }
  return (
    <>
      {props.isExpanded && (
        <button
          className="addNewComment"
          onClick={() => setNewComment(!newComment)}
        >
          Add New Comment
        </button>
      )}
      {newComment ? (
        <>
          <form onSubmit={handleSubmit(addNewComment)}>
            <label htmlFor="name">Title</label>
            <input
              type="text"
              id="name"
              name="name"
              {...register("name")}
            ></input>
            <label htmlFor="body">Body</label>
            <input
              type="text"
              id="body"
              name="body"
              {...register("body")}
            ></input>
            <button>Add</button>
          </form>
        </>
      ) : null}
      {props.showComments ? (
        <>
          <h1>Comments</h1>
          {commentsList.length > 0 ? (
            commentsList.map((comment) => (
              <Comment
                onDelete={deleteComment}
                edit={updateComment}
                id={comment.id}
                key={comment.id}
                name={comment.name}
                body={comment.body}
                email={comment.email}
                currentUser={comment.email == userEmail}
              ></Comment>
            ))
          ) : (
            <p>No Comments</p>
          )}
          <button
            className="closeComments"
            onClick={() => props.setShowComments(false)}
          >
            Close Comments
          </button>
        </>
      ) : null}

      <Outlet></Outlet>
    </>
  );
}
