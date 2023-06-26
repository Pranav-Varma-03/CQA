import { useState, useEffect } from "react";
import axios from "axios";
import UserPosts from "./Posts/user_posts";
import { Tabs, Tab } from "react-bootstrap";


export default function Profile(props) {


    const [userdata, setuserdata] = useState([]);



    useEffect(() => {
        console.log("doing")
        const do_this = async () => {
            console.log(props.id)
            const res = await axios.get(`http://localhost:3001/profile?id=${props.id}`);

            setuserdata(res.data)
        }

        do_this();
    }, [props.id])


    return (
        <>

            <div className="container justify-content-center d-flex" style={{ height: window.innerHeight }}>
                <div className="card" style={{ marginTop: "50px", height: "530px" }}>
                    <div className="container justify-content-center d-flex">
                        <div className="text-center" style={{ height: "300px", width: "850px", border: "0px", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }}>
                            <div className="card mt-4" style={{ width: "850px", height: "300px", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                                <img className="mx-0" src={'https://wallpaper.dog/large/20496846.jpg'} alt="Add Your Cover" style={{ width: "850px", height: "420px", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px", borderTopLeftRadius: "25px", borderTopRightRadius: "25px" }} onClick={() => { }} />
                            </div>
                        </div>
                    </div>

                    <div className="cardbody mt-1" >
                        <div className='row justify-content-center' style={{ width: "900px", height: "170px" }}>
                            <div className="col-9 col-lg-2 pt-4">
                                <img className='image-fluid rounded-circle border border-rounded border-5 border-light'
                                    alt=""
                                    src={'https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg'}
                                    style={{ width: "175px", height: "175px", borderRadius: "87.5px", position: 'absolute' }}
                                />
                            </div>

                            <div className="col-9 col-lg-4" style={{ paddingTop: "100px", paddingLeft: '0px' }}>
                                <div className="m-2 mt-0 ">

                                </div>
                            </div>

                            <div className="col-9 col-lg-3 pt-5">
                               
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: "#f0f2f5" }}>

                        <Tabs
                            defaultActiveKey="home"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                            style={{ paddingLeft: "350px" }}
                        >
                            <Tab eventKey="home" title="Profile" justify="content-center" >
                                <div className='container d-flex justify-content-center'>
                                    <div className="card d-flex justify-content-center mt-5" style={{ width: "70%" }}>
                                        <div className='col-md-12'>
                                            <div className='card-body pt-1'>
                                                <div className='row'>
                                                    <div className=' col-sm-3 pt-3'>
                                                        <h6>User Name</h6>
                                                    </div>
                                                    <div className=' col-sm-9 pt-3'>{userdata.username}</div>
                                                </div>
                                                <hr className='horizontal-divider mt-0' />

                                                <div className='row'>
                                                    <div className=' col-sm-3 pt-1'><h6>Gmail</h6></div>
                                                    <div className=' col-sm-9 pt-1'>{userdata.gmail}</div>
                                                </div>
                                                <hr className='horizontal-divider mt-0' />

                                                <div className='row'>
                                                    <div className=' col-sm-3 pt-1'><h6>Upvotes</h6></div>
                                                    <div className=' col-sm-9 pt-1'>{userdata.upvotes}</div>
                                                </div>
                                                <hr className='horizontal-divider mt-0' />

                                                <div className='row'>
                                                    <div className=' col-sm-3 pt-1'><h6>Downvotes</h6></div>
                                                    <div className=' col-sm-9 pt-1'>{userdata.downvotes}</div>
                                                </div>
                                                <hr className='horizontal-divider mt-0' />

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Tab>
                            <Tab eventKey="posts" title="Posts">
                                <div className="container d-flex justify-content-center">
                                    <div className="card d-flex justify-content-center mt-5" style={{ width: "70%" }}>
                                        <UserPosts id={props.id} />
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
}