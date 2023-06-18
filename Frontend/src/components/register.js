import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './register.css'
import { Form ,Button} from 'react-bootstrap';
import axios from 'axios';


export default function Register(){

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [userName, setuserName] = useState('');

    const register = async(e) => {
        e.preventDefault();
        
        await axios.post('http://localhost:3001/register',{
            email : email,
            username: userName
        }).then(async (res)=>{
                if(res.status === 200)
                {
                  alert("Successfully registered")
                  navigate('/login');
                }
        }).catch((e)=>{
          alert("Username or email is already taken , try again")
        })
    }

    return (
        <>
        <div style={{height: window.innerHeight}}>
        <div className="newone container d-flex justify-content-center" >
          <div className='card d-flex justify-content-center' style={{width:"500px"}}>
            <div className='card-header d-flex justify-content-center'><h3>Create a New Account</h3></div>
              <div className='card-body d-flex justify-content-center'>
                       
              <Form onSubmit={register}>
                                    <Form.Group className="mb-4 w-125" controlId="formBasicEmail" style={{width:'400px'}}>
                                        <Form.Control
                                            type="mail"
                                            placeholder="Email"
                                            onChange={(e)=>{setEmail(e.target.value)}}/>
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formBasicText">
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            onChange={(e)=>{setuserName(e.target.value)}}/>
                                    </Form.Group>
                                    <div className="butto">
                                        <div className="d-grid gap-2 pl-5">
                                            <Button variant="primary" type="Submit">
                                                Log In
                                            </Button>
                                        </div>
                                    </div>
                                </Form>


            </div>
            </div>
        </div>
        </div>
  
</>
    )
}
