import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import '../Posts/up.css'

export default function UserPosts(props) {
  const [user_posts, setposts] = useState([]);
  const [tempnumber, settempnumber] = useState(10)
  const [page, setpage] = useState(0);
  const [number, setnumber] = useState(10);
  const [nextpage_counter, setit] = useState(1);

  const [type, settype] = useState(0);

  useEffect(() => {
    const dothis_3 = async () => {
      if (!isNaN(props.id)) {
        await axios.get(`http://localhost:3001/user_posts?page=${page}&number=${number}&id=${props.id}&type=${type}`).then((res) => {
          if (parseInt(res.data.length) === parseInt(number)) {
            setit(1);
            if (res.data !== 404) {
              setposts(res.data);
            }
          }
          else {
            setit(0);
            if (res.data !== 404) {
              setposts(res.data);
            }
          }
        }).catch((e) => {
          console.log(e)
        })
      }
      else {

      }
    }

    dothis_3();
  }, [page, type, number, props.id])

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

  if (props.id !== 0) {
    return (
      <>
        <h3 className="filter">Filter By</h3>
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" value="upVotes" className="radio" name="filter" onClick={() => { settype(1); setpage(0) }} /><p className="text"> Upvotes Incr</p>
        <input type="radio" value="upVotes" className="radio" name="filter" onClick={() => { settype(3); setpage(0) }} /> <p className="text">Upvotes desc </p>
        <input type="radio" value="timeStamp" className="radio" name="filter" onClick={() => { settype(2); setpage(0) }} /><p className="text">Timestamp latest</p>
        <input type="radio" value="timeStamp" className="radio" name="filter" onClick={() => { settype(4); setpage(0) }} /><p className="text1"> Timestamp earlier</p>
         
        
        </div>


        <div className="container my-3">
          <div className="row">
            {
              user_posts.map((one) => (
                <div className="col-md-4" key={one.post_id}>
                  <div className='container d-flex justify-content-center pt-3 pl-5'>
                    <div className='card' style={{ width: "600px", height: "150px" }}>
                      <div className='row  g-0'>
                        <div className='col'>

                          <Link to={`/posts/${one.post_id}/${one.title}`} className="pt-1 mt-2" style={{ marginTop: "40px", marginLeft: "10px" }}>{one.title}</Link>
                          {time_ago(one.duration)}

                          <p>{one.upvotes} upvotes , {one.downvotes} downvotes</p>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>


              ))
            }
          </div>
        </div>

        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-md-1 pr-5">
              <Button disabled={!page} onClick={() => { if (page > 0) { setpage(page - 1) } }}>Prev</Button>
            </div>
            <div className="col-md-1 d-flex ">
              <Button disabled={!nextpage_counter} onClick={() => { setpage(page + 1) }}>Next</Button>
            </div>
          </div>
          <div className="row justify-content-center pt-5">
            <form className="form-inline my-3 ">
              <label><h4 style={{ paddingLeft: '50px' }}>Enter the number of results per page : </h4></label>
              <input className="form-control mr-sm-2"
                type="search" placeholder="Number of results per page"
                value={tempnumber}
                onChange={(e) => settempnumber(e.target.value)}
                aria-label="Search" />
              <div className="container my-3" style={{ paddingLeft: '300px' }}>
                <Button onClick={() => { setnumber(tempnumber) }}>Change</Button>
              </div>
            </form>
          </div>
        </div>


      </>
    )
  }
  else {
    return (
      <>

      </>
    )
  }
}