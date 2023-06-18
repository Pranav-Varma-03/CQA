import Cookies from "js-cookie";
import { useContext } from "react";
import { authContext } from "../auth/Auth";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import './nav.css'

export default function Navigation() {

  const { auth, setAuth } = useContext(authContext);
  // const ecookie = Cookies.get('User')
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setAuth(false);
    Cookies.remove('User');
    console.log(auth);
    navigate('login');
  }

  const onClickUser = (e) => {
    e.preventDefault();
    navigate('/users');
  }
  const onClickPosts = (e) => {
    e.preventDefault();
    navigate('/posts');
  }
  const onClickTags = (e) => {
    e.preventDefault();
    navigate('/tags');
  }
  const onClickCreate = (e) => {
    e.preventDefault();
    navigate('/newpost');
  }


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/home">StackOverflow</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-itemUB">
              <button className="UB" onClick={onClickUser}> Users </button>
            </li >
            <li className="nav-itemPB">
              <button className="PB" onClick={onClickPosts}> Posts Button</button>
            </li>
            <li className="nav-itemTB">
              <button className="TB" onClick={onClickTags}> Tags Button</button>
            </li>
            <li className="nav-itemCPB">
              <button className="CPB" onClick={onClickCreate}> Create Post Button</button>
            </li>
            <li className="nav-itemLG">
              <Button onClick={handleClick} >Logout</Button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}