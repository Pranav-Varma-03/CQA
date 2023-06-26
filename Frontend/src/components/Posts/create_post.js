import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import '../Posts/cp.css'
import { useNavigate } from "react-router-dom";

export default function Createpost() {



  const [title, settitle] = useState('');
  const navigate = useNavigate();
  const [body, setbody] = useState('');
  const [sing_tag, setsing_tag] = useState('');

  const [tag_data, setdata] = useState([]);
  const [page, setpage] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [number, setnumber] = useState(10);
  const [nextpage_counter, setit] = useState(1);

  const [selectedtags, setselectedtags] = useState([]);

  const ecooke = Cookies.get('User')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted" + ecooke)
    const submit = async () => {
      await axios.post(`http://localhost:3001/create-post`, {
        title: title,
        body: body,
        tags: selectedtags,
        user_id: ecooke
      }).then((res) => {
        alert("Successfully created new post")
        navigate("/home")
      })
    }

    if(title !== ''&& body !== '' && selectedtags !== [])
    {
      submit();
    }
    else
    {
      alert("Fill all the data")
    }
    

  }

  useEffect(() => {
    const dothis = async () => {
      await axios.get(`http://localhost:3001/tags?page=${page}&number=${number}&search=${sing_tag}`).then((res) => {
        if (res.data.length === number) {
          setit(1);
          setdata(res.data);
        }
        else {
          setit(0);
          setdata(res.data);
        }
      }).catch((e) => {
        console.log(e)
      })
    }

    dothis();

  }, [sing_tag, number, page])

  useEffect(() => { console.log(selectedtags) }, [selectedtags])


  return (
    <div>
      <p className="center" id="cp">Create Post</p>
      <div>
        <div className="center" id="addtitlee">
          <label> <p >Add Title:</p>
            <input
              type="text"
              value={title}
              id="textfield"
              onChange={(e) => settitle(e.target.value)}
            />
          </label>
        </div>
        <div className="form-outline">
          <label className="form-label" htmlFor="textAreaExample">Message:</label>
          <textarea className="form-control" id="textAreaExample" rows="4" value={body}
            onChange={(e) => setbody(e.target.value)} ></textarea>
        </div>
        <div className="addtags">
          <div >
            <label> <text className="adt">Add Tags:</text>
              <input
                type="text"
                value={sing_tag}
                onChange={(e) => setsing_tag(e.target.value)}
            />
            </label>
          </div>

          <p className="select"> Selected tags :</p>

          <ul>
            {selectedtags.map((one) => (
              <li key={one}>
                <button
                  onClick={() => {
                    setselectedtags((selectedtags) => {
                      return selectedtags.filter((value) => value !== one)
                    })
                  }}
                >{one}</button>
              </li>
            ))}
          </ul>


          <p> Available tags :</p>

          <ul>
            {tag_data.map((one) => (
              <li key={one.tag_name}>
                <button onClick={() => {
                  if (selectedtags.indexOf(one.tag_name) === -1) {
                    setselectedtags(selectedtags.concat(one.tag_name))
                  }
                }}>{one.tag_name}</button>
              </li>
            ))}
          </ul>
          <div className="pageButt">
          <button disabled={!page} id="pp" onClick={() => { if (page > 0) { setpage(page - 1) } }}>Prev</button>
          <button disabled={!nextpage_counter} className="pageButt" onClick={() => { setpage(page + 1) }}>Next</button>
          </div>

        </div>




        <div className="createpost">
          <button className="button is-primary" onClick={handleSubmit}>Create Post</button>
        </div>


      </div>
    </div>
  );
}