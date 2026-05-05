import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import NavBar from "./NavBar";
import AlbumLink from "./AlbumLink";
import Loading from "./Loading";
import { appContext } from "../App";
export default function Albums() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { userID } = useContext(appContext);
  const [useresAlbums, setUsersAlbums] = useState([]);
  const [albumView, setAlbumView] = useState(false);
  const [searchID, setSearchID] = useState(searchParams.get("id") || "");
  const [inputSearchID, setInputSearchID] = useState("");
  const [searchTitle, setSearchTitle] = useState(
    searchParams.get("title") || ""
  );
  const [inputSearchTitle, setInputSearchTitle] = useState("");

  const [newAlbumsTitle, setNewAlbumsTitle] = useState("");
  const [check, setCheck] = useState(() => () => {
    return true;
  });
  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  useEffect(() => {
    setSearchTitle(searchParams.get("title") || "");
    setSearchID(searchParams.get("id") || "");
  }, [searchParams]);
  useEffect(() => {
    if (searchID != "")
      setCheck(() => (album) => {
        return album.id == searchID;
      });
    if (searchTitle != "")
      setCheck(() => (album) => {
        return album.title == searchTitle;
      });
    if (searchID == "" && searchTitle == "")
      setCheck(() => () => {
        return true;
      });
  }, [searchID, searchTitle]);
  useEffect(() => {
    async function getAlbums() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/albums/?userId=${userID}`
        );
        if (!response.ok)
          throw new Error(
            `status: ${response.status}\n The sever could not get the albums, please try again later.`
          );
        const data = await response.json();
        setUsersAlbums(data);
      } catch (error) {
        alert(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    if (userID) getAlbums();
  }, []);

  async function addNewAlbum() {
    try {
      const response = await fetch(`http://localhost:3000/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAlbumsTitle,
          userId: Number(userID),
        }),
      });
      if (!response.ok)
        throw new Error(
          `status: ${response.status}\n The server could not add the albums to the database, please try again later`
        );
      const newAlbum = await response.json();
      setUsersAlbums((prev) => [...prev, newAlbum]);
      setNewAlbumsTitle("");
    } catch (error) {
      alert(error);
    }
  }
  async function deleteAlbum(id) {
    try {
      const response = await fetch(`http://localhost:3000/albums/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `status: ${response.status}\n The server could not delete the albums from the database, plaese try again later.`
        );
      }
      setUsersAlbums((prev) => prev.filter((album) => album.id != id));
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      {loading ? <Loading message="Loading Albums..."></Loading> : null}
      <NavBar></NavBar>
      <h1>Albums</h1>
      <div className="filters">
        <button
          onClick={() => {
            setCheck(() => () => {
              return true;
            });
            navigate(`/Albums/${userID}`);
          }}
        >
          Back to all albums
        </button>
        <button onClick={addNewAlbum}>Add Album</button>
        <input
          type="text"
          placeholder="Enter album title"
          value={newAlbumsTitle}
          onChange={(e) => setNewAlbumsTitle(e.target.value)}
        />
        <button
          onClick={() => {
            setSearchTitle(inputSearchTitle);
            navigate(`?title=${inputSearchTitle}`);
          }}
        >
          By Title
        </button>
        <input
          type="text"
          placeholder="Enter title"
          value={inputSearchTitle}
          onChange={(e) => setInputSearchTitle(e.target.value)}
        />
        <button
          onClick={() => {
            setSearchID(inputSearchID);
            navigate(`?id=${inputSearchID}`);
          }}
        >
          By ID
        </button>
        <input
          type="text"
          placeholder="Enter ID"
          value={inputSearchID}
          onChange={(e) => setInputSearchID(e.target.value)}
        />
      </div>
      {!albumView && useresAlbums.length > 0 ? (
        useresAlbums.map((album) =>
          check(album) ? (
            <AlbumLink
              title={album.title}
              changeStateAlbumView={setAlbumView}
              userId={userID}
              key={album.id}
              id={album.id}
              deleteAlbum={deleteAlbum}
            ></AlbumLink>
          ) : null
        )
      ) : !albumView ? (
        <p>You Have No Albums</p>
      ) : null}
      <Outlet />
    </>
  );
}
