import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Editpost(props) {

  const [title, settitle] = useState(props.title);
  const [body, setbody] = useState(props.body);
  const [sing_tag, setsing_tag] = useState('');
  const navigate = useNavigate(); 

  const [tag_data, setdata] = useState([]);
  const [page, setpage] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [number, setnumber] = useState(10);
  const [nextpage_counter, setit] = useState(1);

  const [selectedtags, setselectedtags] = useState(props.tags);

  const ecooke = Cookies.get('User')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted" + ecooke)
    const submit = async () => {
      await axios.put(`http://localhost:3001/edit-post`, {
        title: title,
        body: body,
        tags: selectedtags,
        user_id: ecooke,
        post_id: props.post_id
      }).then((res) => {
        if (res.status === 200) {
          props.setModalShow(false)
          navigate(`/posts/${props.post_id}/3`)
        }
      })
    }

    submit();

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
      <div>
        <div>
          <label> Add Title:
            <input
              type="text"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
          </label>
        </div>
        <div className="form-outline">
          <label className="form-label" htmlFor="textAreaExample">Message</label>
          <textarea className="form-control" id="textAreaExample" rows="4" value={body}
            onChange={(e) => setbody(e.target.value)} ></textarea>
        </div>
        <div>
          <label> Add Tags:
            <input
              type="text"
              value={sing_tag}
              onChange={(e) => setsing_tag(e.target.value)}
            />
          </label>

          <p> Selected tags :</p>

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
          <button disabled={!page} onClick={() => { if (page > 0) { setpage(page - 1) } }}>Previous page</button>
          <button disabled={!nextpage_counter} onClick={() => { setpage(page + 1) }}>Next page</button>

        </div>

        <div className="container" style={{ paddingLeft: '350px' }}>
          <Button onClick={handleSubmit} >Edit Post</Button>
        </div>

      </div>
    </div>
  );
}