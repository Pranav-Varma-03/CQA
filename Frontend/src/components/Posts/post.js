import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import DOMPurify from 'dompurify'

import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Editpost from "./edit_post";
import Anspost from "./Anspost";
import './post.css'

export default function Post() {

  const navigate = useNavigate();

  function time_ago(inp) {
    var count = 0;
    if(inp < 35)
    {
      return (
        <p>Just now</p>
      )
    }
    if (parseInt(inp / 31536000) > 0) {
      count = parseInt(inp / 31536000)
      return (
        <p> {count} years ago</p>
      )
    }
    else {
      if (parseInt(inp / 2628000) > 0) {
        count = parseInt(inp / 2628000)
        return (
          <p> {count} months ago</p>
        )
      }
      else {
        if (parseInt(inp / 86400) > 0) {
          count = parseInt(inp / 86400)
          return (
            <p> {count} days ago</p>
          )
        }
        else {
          if (parseInt(inp / 3600) > 0) {
            count = parseInt(inp / 3600)
            return (
              <p> {count} hours ago</p>
            )
          }
          else {
            if (parseInt(inp / 60) > 0) {
              count = parseInt(inp / 60)
              return (
                <p> {count} minutes ago</p>
              )
            }
            else {
              return (
                <p> {inp} seconds ago</p>
              )
            }
          }
        }
      }
    }
  }
  const [modalShow, setModalShow] = useState(false);

  const [modal2Show, setModal2Show] = useState(false);

  const [page, setpage] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [number, setnumber] = useState(10);

  const [nextpage_counter, setit] = useState(1);

  const { postid, postname } = useParams();

  const [data, setdata] = useState([]);

  const [comments, setcomments] = useState([])

  const [tags, settags] = useState([]);


  const ecooke = Cookies.get('User')


  useEffect(() => {
    const dothis = async () => {
      await axios(`http://localhost:3001/posts/${postid}/${postname}`).then((res) => {
        //setid(res.data);
        console.log(11)
        console.log(res.data)
        settags(res.data.tags)
        setdata(res.data)
        if (res.data === 404) {
          navigate('/posts')
        }
        else {
          navigate(`/posts/${postid}/${res.data.title}`)
        }
        console.log(21)
      }).catch((e) => {
        console.log(e)
      });
      await axios(`http://localhost:3001/${postid}/comments?page=${page}&number=${number}`).then((res) => {
        //setid(res.data)
        console.log(11)
        console.log(res.data)
        console.log(12)
        setcomments(res.data)
        if (res.data.length === number) {
          setit(1);
        }
        else {
          setit(0);
        }
      }).catch((e) => {
        console.log(e)
      })
    }
    dothis();
  }, [postid, postname, navigate, page, number])

  async function delete_comm(comm_id) {
    await axios.post(`http://localhost:3001/delcomm`, {
      comm_id: comm_id
    }).then((res) => {
      if (res.status === 200) {
        navigate(`/posts/${postid}/1`)
      }
    })
  }


  const Innercomp = (props) => {
    if (parseInt(props.id) === parseInt(ecooke)) {
      return (
        <Button onClick={() => { delete_comm(props.comm_id) }}>Delete comment</Button>
      )
    }
    else {
      return (
        <></>
      )
    }
  }

  const increase_comment_upvotes = async (comment_id) => {;
    await axios.put(`http://localhost:3001/increasecommentvotes/${comment_id}`).then((res) => {
      if (res.status === 200) {
        console.log("increase comment upvote")
        navigate(`/posts/${postid}/2`)
      }
    })
  }

  const increase_comment_downvotes = async (comment_id) => {
    await axios.put(`http://localhost:3001/decreasecommentvotes/${comment_id}`).then((res) => {
      console.log("aegdfab")
      if (res.status === 200) {
        console.log("decreased comment upvote")
        navigate(`/posts/${postid}/2`)
      }
    })
  }


  const Dothis = () => {
    if (comments.length !== 0) {
      return (
        <>
          <ul>
            {comments.map((one) => (
              <li key={one.comment_id}>
                <p >{one.body}  -  By {one.usernameofcomm} </p>
                {/* <p >{one.upvotes} upvotes , {one.downvotes} downvotes </p> */}
                <button onClick={()=>{increase_comment_upvotes(one.comment_id)}}> {one.upvotes} Upvotes </button>

                <button onClick={()=>{increase_comment_downvotes(one.comment_id)}}> {one.downvotes} Downvotes</button>
                {time_ago(one.duration)}

                {<Innercomp id={one.user_id} comm_id={one.comment_id} />}
              </li>



            ))}
          </ul>
          <button disabled={!page} onClick={() => { if (page > 0) { setpage(page - 1) } }}>Prev</button>
          <button disabled={!nextpage_counter} onClick={() => { setpage(page + 1) }}>Next</button>
        </>
      )
    }
    else {
      return (
        <></>
      )
    }
  }

  const Isitedited = () => {
    if (data.edit_status === 1) {
      console.log("asdgad")
      return (
        <>
          <p>"""Edited"""</p>
        </>
      )
    }
    else {
      return (
        <></>
      )
    }
  }

  useEffect(() => {

  }, [])

  const increase_upvotes = async () => {;
    await axios.put(`http://localhost:3001/increasevotes/${postid}`).then((res) => {
      if (res.status === 200) {
        console.log("increase upvote")
        navigate(`/posts/${postid}/1`)
      }
    })
  }

  const increase_downvotes = async () => {
    await axios.put(`http://localhost:3001/decreasevotes/${postid}`).then((res) => {
      if (res.status === 200) {
        console.log("decreased upvote")
        navigate(`/posts/${postid}/1`)
      }
    })
  }

  const delete_this = async () => {
    await axios.post(`http://localhost:3001/delpost`, {
      post_id: data.post_id
    }).then((res) => {
      if (res.status === 200) {
        alert("Succesfullt deleted");
        navigate('/home');
      }
    })
  }

  const Fortags = () => {
    if (tags.length !== 0) {
      console.log(1)
      console.log(tags)
      return (
        <>
          <ul>
            {tags.map((one) => (
              <li key={one}>
                <button >{one}</button>
              </li>
            ))}
          </ul>
        </>
      )
    }
    else {
      return (
        <></>
      )
    }
  }

  if (data.user_id === parseInt(ecooke)) {
    return (
      <>
        {<Isitedited />}

        <h1>{postname}</h1>

        <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }}></div>


        {<Fortags />}

        <div className="container">
          <button onClick={increase_upvotes}> {data.upvotes} Upvotes </button>

          <button onClick={increase_downvotes}> {data.downvotes} Downvotes</button>
        </div>

        <p className="postdata">By {data.post_user}</p>

        {time_ago(data.duration)}

        <Button onClick={() => { setModalShow(true) }}>Edit post</Button>

        <Button onClick={delete_this}>Delete Post</Button>

        <Modal
          show={modalShow}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Post
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Editpost title={data.title} body={data.body} tags={data.tags} post_id={data.post_id} setModalShow={setModalShow}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={modal2Show}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
              Answer Post
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Anspost post_id={data.post_id} title={data.title} setModal2Show={setModal2Show}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModal2Show(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <div className="container" style={{ paddingBottom: '10px' }}>
          <Button onClick={() => { setModal2Show(true) }} >Answer post</Button>
        </div>

        <h2>comments</h2>

        {<Dothis />}
        <Link  to={"/posts"}><div className="back">{"<"}{"<"}{"<"}Back to Posts{">"}{">"}{">"}</div></Link>
      </>
    )
  }
  else {
    return (
      <>
        {<Isitedited />}

        <h1>{postname}</h1>

        <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }}></div>

        {<Fortags />}

        <div className="container">
          <button className="votebutton" onClick={increase_upvotes}> {data.upvotes} Upvotes </button>

          <button className="votebutton" onClick={increase_downvotes}> {data.downvotes} Downvotes</button>
        </div>

        <p className="postdata">By {data.post_user}</p>

        <p className="postdata">{time_ago(data.duration)}</p>

        <Modal
          show={modal2Show}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
              Answer Post
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Anspost post_id={data.post_id} title={data.title} setModal2Show={setModal2Show} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModal2Show(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <div className="container" style={{ paddingBottom: '10px' }}>
          <Button onClick={() => { setModal2Show(true) }} >Answer post</Button>
        </div>


        <h2>Comments</h2>

        {<Dothis />}
        <p><hr></hr></p>
        
        <Link  to={"/posts"}><div className="back">{"< < <"}Back to Posts{"> > >"}</div></Link>
        
      </>
    )
  }
};