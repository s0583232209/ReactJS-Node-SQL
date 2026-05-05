import { useHref, useNavigate, useParams } from "react-router-dom";
import Photo from "./Photo";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import NavBar from "./NavBar";
import "./Album.css";
import Loading from "./Loading";
import { appContext } from "../App";
export default function Album() {
  const navigate = useNavigate();
  const href = useHref();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState(() => {
    if (localStorage.getItem("photos"))
      return JSON.parse(localStorage.getItem("photos"));
    else return [];
  });

  const { id } = useParams();
  const albumId = id;
  const { userID } = useContext(appContext);
  const [title, setTitle] = useState();
  const [visibleCount, setVisibleCount] = useState(() => {
    if (localStorage.getItem("visibleCountAlbum"))
      return JSON.parse(localStorage.getItem("visibleCountAlbum"));
    else return 4;
  });
  let user;
  useEffect(() => {
    const hrefSplit = href.split("/");
    user = hrefSplit[hrefSplit.length - 2];
  }, [href]);
  useEffect(() => {
    async function checkAccess() {
      if (!userID) navigate("/login");
      try {
        if (userID !== user && userID !== undefined) navigate("/access_denied");
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/albums/${albumId}?userId=${userID}`
        );
        if (!response.ok)
          throw new Error(
            "status: " + response.status + "\n from check access"
          );
        const data = await response.json();
        if (data.userId != userID) navigate("/access_denied");
        setTitle(data.title);
      } catch (error) {
        alert(error);
        navigate("/");
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    }
    if (userID) checkAccess();
  }, [userID]);

  useEffect(() => {
    localStorage.setItem("visibleCountAlbum", JSON.stringify(visibleCount));
    return () => {
      localStorage.removeItem("visibleCountAlbum");
    };
  }, [visibleCount]);
  useEffect(() => {
    async function getPhotos() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/photos/?albumId=${albumId}&_start=${
            visibleCount - 4
          }&_end=${visibleCount}`
        );
        if (!response.ok)
          throw new Error(
            "status: " +
              response.status +
              "\n the server did not respose for fetching more photos, try again later"
          );
        let data = await response.json();
        setPhotos((prev) => {
          data = data.filter(
            (photo1) => !prev.some((photo2) => photo1.id === photo2.id)
          );
          return [...prev, ...data];
        });
      } catch (error) {
        alert(error);
        navigate("/");
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    }
    if (photos.length < visibleCount) getPhotos();
  }, [id, visibleCount]);
  useEffect(() => {
    localStorage.setItem("photos", JSON.stringify(photos));
    return () => {
      localStorage.removeItem("photos");
    };
  }, [photos]);
  async function deletePhoto(id) {
    try {
      const response = await fetch(`http://localhost:3000/photos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `status: ${response.status} \n The server could not delete this photo, please try again later.`
        );
      }
      setPhotos((prev) => prev.filter((photo) => photo.id != id));
    } catch (error) {
      alert(error);
    }
  }
  async function changeTitle(id, newTitle) {
    let photo = photos.find((photo) => photo.id == id);
    photo.title = newTitle;
    try {
      const response = await fetch(`http://localhost:3000/photos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo),
      });
      if (!response.ok)
        throw new Error(
          `staus: ${response.status}\n The server could not update the title for this photo, please try again later`
        );
      setPhotos((prev) =>
        prev.map((photo) => {
          if (photo.id == id) photo.title = newTitle;
          return photo;
        })
      );
    } catch (error) {
      alert(error);
    }
  }
  async function addPhoto(data) {
    try {
      const response = await fetch(`http://localhost:3000/photos`, {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ albumId: `${albumId}`, path: `${data.URL}` }),
      });
      if (!response.ok) {
        throw new Error(
          `staus: ${response.status}\n The server could not add this URL, please try again later`
        );
      }
      const newPhoto = await response.json();
      setPhotos((prev) => [...prev, newPhoto]);
    } catch (error) {
      alert(error);
    }
  }
  return (
    <>
      {loading ? <Loading message="Loading Photos..."></Loading> : null}
      <NavBar></NavBar>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit(addPhoto)}>
        <label htmlFor="url">Enter URL</label>
        <input
          type="text"
          id="url"
          name="url"
          placeholder="url"
          {...register("URL")}
          required
        ></input>
        <button>Add</button>
      </form>
      {photos.length > 0 ? (
        <div className="photos-grid">
          {photos.map((photo) => (
            <Photo
              title={photo.title}
              key={photo.id}
              path={photo.path}
              id={photo.id}
              delete={deletePhoto}
              changeTitle={changeTitle}
            />
          ))}
        </div>
      ) : (
        <p>no photos</p>
      )}
      {visibleCount <= photos.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0",
          }}
        >
          <button
            onClick={() => {
              setVisibleCount(visibleCount + 4);
            }}
            style={{
              backgroundColor: "#a8dadc",
              color: "#064635",
              border: "none",
              borderRadius: "6px",
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#90c9d0";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#a8dadc";
              e.target.style.transform = "translateY(0)";
            }}
          >
            📷 Show More Photos
          </button>
        </div>
      ) : null}
    </>
  );
}
