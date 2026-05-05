import { useState } from 'react'
export default function Comment(props) {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(props.name);
    const [newBody, setNewBody] = useState(props.body);
    function startEdit() {
        setNewName(props.name);
        setNewBody(props.body);
        setEditing(true);
    }
    function cancelEdit() {
        setEditing(false);
    }
    function saveEdit() {
        if (newName.trim() === "") return;
        props.edit(props.id, { name: newName, body: newBody });
        setEditing(false);
    }
    return (
        <>
            {props.currentUser ? (<>{editing ? (<>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                <input type="text" value={newBody} onChange={e => setNewBody(e.target.value)} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
            </>) : (<>
                <h3>{props.email}</h3>
                <h2>{props.name}</h2>
                <h3>{props.body}</h3>
                <button className="delete" onClick={() => props.onDelete(props.id)}>Delete</button>
                <button className="edit" onClick={startEdit}>Edit</button>
            </>)}
            </>) : (<>
                <h3>{props.email}</h3>
                <h2>{props.name}</h2>
                <h3>{props.body}</h3>
            </>)
            }

        </>
    )
}



