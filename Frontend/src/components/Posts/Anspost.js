import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Anspost(props) {

  const [body, setbody] = useState('');

  const navigate = useNavigate('');

  const ecooke = Cookies.get('User')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted" + ecooke)
    const submit = async () => {
      await axios.post(`http://localhost:3001/anspost`, {
        body: body,
        user_id: ecooke,
        post_id: props.post_id
      }).then((res) => {
        if (res.status === 200) {
          props.setModal2Show(false)
          navigate(`/posts/${props.post_id}/2`)
        }
      })
    }

    submit();

  }



  return (
    <div>
      <div>
        <div className="form-outline">
          <label className="form-label" htmlFor="textAreaExample">Answer</label>
          <textarea className="form-control" id="textAreaExample" rows="4" value={body}
            onChange={(e) => setbody(e.target.value)} ></textarea>
        </div>



        <div className="container" style={{ paddingLeft: '350px' }}>
          <Button onClick={handleSubmit} >Answer Post</Button>
        </div>

      </div>
    </div>
  );
}