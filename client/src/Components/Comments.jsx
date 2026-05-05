import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Comment from "./Comment";
export default function Comments(props) {
    const [commentsList, setCommentsList] = useState([]);
    const [newComment, setNewComment] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const userEmail = JSON.parse(sessionStorage.getItem("current-user")).email || "null";
    useEffect(() => {
        setCommentsList([]);
    }, [props.postId]);

    useEffect(() => {
        async function getComments() {
            const response = await fetch(`http://localhost:3000/comments/?postId=${props.postId}`);
            if (!response.ok)
                throw new Error(
                    "Error: response is not ok, status:  " + response.status
                );
            const data = await response.json();
            setCommentsList(data);
        }
        getComments();
    }, [props.postId]);
    async function deleteComment(id) {
        const response = await fetch(`http://localhost:3000/comments/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setCommentsList((prev) => prev.filter((comment) => comment.id !== id));
        }
    }
    async function addNewComment(data) {
        if (data.name.trim() === "") {
            setNewComment(false);
            return;
        }
        const response = await fetch(`http://localhost:3000/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postId: props.postId,
                name: data.name,
                email: userEmail,
                body: data.body,
            }),
        });
        if (response.ok) {
            setNewComment(false);
            const newCommentResponse = await response.json();
            setCommentsList((prev) => [...prev, newCommentResponse]);
            reset();
        }
    }
    async function updateComment(commentId, updates) {
        const commentToEdit = commentsList.find((p) => p.id === commentId);
        const editedComment = { ...commentToEdit, ...updates };
        const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedComment),
        });
        if (response.ok) {
            const updatedComment = await response.json();
            setCommentsList((prev) =>
                prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
            );
        }
    }
    return (
        <>

            <button className="addNewComment" onClick={() => setNewComment(!newComment)}>
                Add New Comment
            </button>
            {newComment ? (
                <>
                    <form onSubmit={handleSubmit(addNewComment)}>
                        <label htmlFor="name">Name</label>
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
            {props.showComments ? (<>
                <h1>Comments</h1>
                {commentsList.length > 0 ? (
                    commentsList.map((comment) =>
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
                    )
                ) : (
                    <p>No Comments</p>
                )}
                <button className="closeComments" onClick={() => props.setShowComments(false)}>Close Comments</button>
            </>) : null}

            <Outlet></Outlet>
        </>
    )
}






