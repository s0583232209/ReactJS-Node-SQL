import { useState } from "react";

export default function Photo(props) {
  const [newTitle, setNewTitle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleSubmit = () => {
    if (newTitle.trim()) {
      props.changeTitle(props.id, newTitle);
      setNewTitle("");
      setIsEditing(false);
    }
  };

  return (
    <div 
      className="photo-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-block',
        margin: '8px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        cursor: 'pointer'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img 
          src={props.path} 
          alt={props.title}
          style={{
            maxWidth: '300px',
            maxHeight: '300px',
            width: 'auto',
            height: 'auto',
            display: 'block'
          }}
        />
        
        {/* Hover overlay with buttons */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease'
        }}>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.delete(props.id);
            }}
            style={{
              background: 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(244, 67, 54, 1)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(244, 67, 54, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
            title="Delete photo"
          >
            🗑️
          </button>
          
          {/* Edit title button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            style={{
              background: 'rgba(33, 150, 243, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(33, 150, 243, 1)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(33, 150, 243, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
            title="Edit title"
          >
            ✏️
          </button>
        </div>
      </div>
      
      {/* Title section - only show if there's a title or editing */}
      {(props.title || isEditing) && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fff'
        }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={newTitle}
                placeholder={props.title || "Enter title"}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                style={{
                  flex: 1,
                  padding: '4px 6px',
                  border: '1px solid #80cfa9',
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none'
                }}
                autoFocus
              />
              <button
                onClick={handleTitleSubmit}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewTitle("");
                }}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#064635',
              fontWeight: '500',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              lineHeight: '1.3',
              maxWidth: '100%'
            }}>
              {props.title}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
