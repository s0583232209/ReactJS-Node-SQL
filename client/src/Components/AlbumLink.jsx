import { useState, useEffect, useContext } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useHref,
  useParams,
} from "react-router-dom";
import Album from "./Album";
import { appContext } from "../App";

export default function AlbumLink(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  const { userID } = useContext(appContext);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!userID) navigate("/login", { state: "this should be the url" });
    if (!(id == userID)) navigate("/access_denied");
  }, []);
  useEffect(() => {
    if (show) {
      props.changeStateAlbumView(true);
      navigate(`${props.id}`);
    }
  }, [show]);
  return (
    <div className="albumLink">
      <h3>
        #{props.id} - {props.title}
      </h3>
      <button
        onClick={() => {
          setShow(true);
        }}
      >
        Open Album
      </button>
      <button onClick={() => props.deleteAlbum(props.id)}>Delete</button>
    </div>
  );
}
