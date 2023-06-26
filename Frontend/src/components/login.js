import { useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { authContext } from "./auth/Auth";
import Cookies from 'js-cookie';
import axios from "axios";
import Modal from '@mui/material/Modal'
import { Box} from "@mui/material";
import {Button , Container, Form, Row , Col} from 'react-bootstrap'
import './login.css'
import {Link} from 'react-router-dom'
<style>
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');
</style>

const style = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform : 'translate(-50%,50%)',
    width : 350,
    bgcolor : 'background.paper',
    border : '2px solid #000',
    boxShadow: 24,
    pt:2,
    px:4,
    pb:3
}



export default function Login(){
    const navigate = useNavigate();

    const {auth , setAuth} = useContext(authContext);

    console.log("Login.js is being rendered "+auth);

    const [password , setpassword] = useState('')
    const [loginname,setloginname] = useState('')

    const [opening,setopening] = useState(false)
    const handleSubmit = async (e)=>{
        e.preventDefault();
        await axios.post('http://localhost:3001/check-auth',{
            username: loginname,
            password: password
        }).then(async (res)=>{
                if(res.data !== 0)
                {
                    await setAuth(1);
                    Cookies.set('User', parseInt(res.data));
                    navigate('/home');
                }
                else
                {
                    await setAuth(0);
                    setloginname('');
                    setpassword('')
                    setopening(true)
                }
        }).catch((e)=>{
            console.log(e)
        })
    };

    return(
        <>
            <Modal open={opening} onClose={()=>{setopening(false)}}> 
                <Box sx={{ ...style, width:500}}>
                    <h3> Enter the correct credentials</h3>
                </Box>
            </Modal>
            <div className="body1" style={{height: window.innerHeight}}>
                <Container>
                    <div className="newbox">
                    <Row>
                        <Col>
                            <div className="title">Stack Overflow</div>
                            <p className="tagline"> Get answers to all your questions</p>
                        </Col>

                        <Col>
                            <div className="p-4 box w-75 text-black ">
                                <p className="loginbox ">Login</p>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4" controlId="formBasicText">
                                        <Form.Control
                                            type="text"
                                            placeholder="User name"
                                            onChange={(e)=>{setloginname(e.target.value)}}/>
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formBasicPassword">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            onChange={(e)=>{setpassword(e.target.value)}}/>
                                    </Form.Group>
                                    <div className="butto">
                                        <div className="d-grid gap-2 pl-5">
                                            <Button variant="primary" type="Submit">
                                                Log In
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                                <br></br>
                                <div className="container d-flex justify-content-center">
                                    <div className="p-4 box mt-3 text-center">
                                        Don't have an account ? <Link to='/register'>Sign Up</Link>
                                    </div>
                                </div>
                            </div>
                            
                        </Col>
                    </Row>
                    </div>
                </Container>
            </div>












        {/* <h1>Login </h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Login Name:
                <input
                type="text" 
                value={loginname}
                onChange={(e) => setloginname(e.target.value)}
                />
            </label>
            </div>
            <div>
            <label>Password:
                <input
                type="password" 
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                />
            </label> 
            </div>
            <div>
                <button className="button is-primary">Login</button>
            </div>
            
        </form> */}
        </>
    );
}