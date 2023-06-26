import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Outlet, useParams } from "react-router-dom"
import UserPosts from "./user_posts";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Button } from "react-bootstrap";
import './posts.css'

export default function Posts() {

    const [username, setusername] = useState('');
    const [user_find_id, setuser_find_id] = useState(0);
    const [tempnumber,settempnumber]=useState(10);

    const [post_data, setdata] = useState([]);
    const [page, setpage] = useState(0);
    const [number, setnumber] = useState(10);
    const [nextpage_counter, setit] = useState(1);
    const [type, settype] = useState(0);
    const [sing_tag, setsing_tag] = useState('');
    const [selectedtags, setselectedtags] = useState([]);
    const [tag_data, settagdata] = useState([]);

    const [page_2, setpage_2] = useState(0);
    const [number_2, setnumber_2] = useState(10);
    const [nextpage_counter_2, setit_2] = useState(1);

    const [page_3, setpage_3] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [number_3, setnumber_3] = useState(10);
    const [nextpage_counter_3, setit_3] = useState(1);
    const [postdata, setpostdata] = useState([]);
    const [type_2, settype_2] = useState(0);
    const data_id = useParams().postid;
    const data_name = useParams().postname;

    const [search, setsearch] = useState('');

    useEffect(() => {
        const dothis = async () => {
            await axios.get(`http://localhost:3001/posts?page=${page}&number=${number}&search=${search}&type=${type}`).then((res) => {
                if (parseInt(res.data.length) === parseInt(number)) {
                    setit(1);
                    setdata(res.data);
                }
                else {
                    setit(0);
                    setdata(res.data);
                }
            }).catch((e) => {
                console.log(e)
            });
        }

        dothis();

    }, [search, number, page, type])

    useEffect(() => {
        const kindly = async () => {
            await axios.get(`http://localhost:3001/tags?page=${page_2}&number=${number_2}&search=${sing_tag}`).then((res) => {
                if (parseInt(res.data.length) === parseInt(number_2)) {
                    setit_2(1);
                    settagdata(res.data);
                }
                else {
                    setit_2(0);
                    settagdata(res.data);
                }
            }).catch((e) => {
                console.log(e)
            })
        }
        kindly();
    }, [sing_tag, number_2, page_2])



    useEffect(() => {
        console.log(selectedtags)
        const please = async () => {
            await axios.post(`http://localhost:3001/tagged_posts`, {
                page: page_3,
                number: number_3,
                type: type_2,
                tags: selectedtags
            }).then((res) => {
                if (parseInt(res.data.length) === parseInt(number_3)) {
                    setit_3(1);
                    setpostdata(res.data);
                }
                else {
                    setit_3(0);
                    setpostdata(res.data);
                }
            }).catch((e) => {
                console.log(e)
            })
        }

        please();
    }, [selectedtags, page_3, number_3, type_2])

    const find_this = () => {
        //setCounter(counter+1)

        const find_id = async () => {
            await axios.get(`http://localhost:3001/findid?username=${username}`).then((res) => {
                setuser_find_id(res.data.user_id);
            })
        }

        if (username !== '') {
            find_id();
        }
    }

    const Tagscomponent = () => {
        if (selectedtags.length !== 0) {
            return (
                <>
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
                </>
            )
        }
        else {
            return (
                <></>
            )
        }
    }

    const Tagpost = () => {
        if (postdata.length !== 0) {
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                <p>Filter</p>
                <input type="radio" value="upVotes" name="filter" onClick={() => { settype_2(1); setpage_3(0) }} /> Upvotes
                <input type="radio" value="timeStamp" name="filter" onClick={() => { settype_2(2); setpage_3(0) }} /> Timestamp
            </div>

            return (
                <> 
                    <p> Posts :</p>

                    <ul>
                        {postdata.map((one) => (
                            <li key={one.post_id}>
                                <Link to={`${one.post_id}/${one.title}`}>{one.title}</Link>
                            </li>
                        ))}
                    </ul>
                    <button disabled={!page_3} onClick={() => { if (page_3 > 0) { setpage_3(page_3 - 1) } }}>Prev</button>
                    <button disabled={!nextpage_counter_3} onClick={() => { setpage_3(page_3 + 1) }}>Next</button>

                </>
            )
        }
        else {
            return (
                <></>
            )
        }
    }

    if (data_id && data_name) {
        return (
            <Outlet />
        )
    }
    else {


        return (
            <>
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="All posts">

                        <h1>Search Post</h1>
                        <div>
                        <div className="Searchbar">
                            <form className="form-inline my-2 my-lg-0" >
                           
                                <input className="form-control mr-sm-2"
                                    type="search" placeholder="Search"
                                    value={search}
                                    id="searchbox"
                                    onChange={(e) => setsearch(e.target.value)}
                                    aria-label="Search" />
                            
                            </form>
                        
                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <p className="filter">Filter</p>

                                <div></div>
                                <div className="filters">
                                <input type="radio" value="upVotes" name="filter" onClick={() => { settype(1); setpage(0) }} /><text> Upvotes</text>
                                
                                <div></div>
                                <input type="radio" value="timeStamp" name="filter" onClick={() => { settype(2); setpage(0) }} /><text> Timestamp</text>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="posts">
                        <ul>
                            {post_data.map((one) => (
                                <li key={one.post_id}>
                                    <Link to={`${one.post_id}/${one.title}`}>{one.title}</Link>
                                </li>
                            ))}
                        </ul>
                        </div>
                        <div className="container pt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-1 ">
                                    <Button disabled={!page} onClick={() => { if (page > 0) { setpage(page - 1) } }}>Prev</Button>
                                </div>
                                <div className="col-md-1 d-flex">
                                    <Button disabled={!nextpage_counter} onClick={() => { setpage(page + 1) }}>Next</Button>
                                </div>
                            </div>
                            <div className="row justify-content-center pt-5">
                                <form className="form-inline my-3 ">
                                    <label><h4 style={{ paddingLeft: '200px' }}>Enter the number of results per page : </h4></label>
                                    <input className="form-control mr-sm-2"
                                        type="search" placeholder="Number of results per page"
                                        value={tempnumber}
                                        onChange={(e) => settempnumber(e.target.value)}
                                        aria-label="Search" />
                                    <Button onClick={() => { setnumber(tempnumber) }}>Change</Button>
                                </form>
                            </div>
                        </div>
                        
                    </Tab>
                    <Tab eventKey="profile" title="Search by user">
                        <h1>Search posts by a user</h1>
                        <div>

                            <div className="row">
                                <div className="col-md-3 pl-3">
                                <div className="Searchbar">
                                    <form className="form-inline my-2 my-lg-0">
                                        <input className="form-control mr-sm-2"
                                            type="search" placeholder="Search"
                                            value={username}
                                            id="searchbox"
                                            onChange={(e) => setusername(e.target.value)}
                                            aria-label="Search" />
                                    </form>
                                    </div>
                                </div>
                                <div className="col-md-3 pr-5">
                                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={find_this}>Search</button>
                                </div>
                            </div>


                            <UserPosts id={user_find_id} />
                        </div>
                    </Tab>
                    <Tab eventKey="contact" title="Search by tag" >
                        <h1>Search posts by tags</h1>
                        <div>
                        <div className="Searchbar">
                            <form className="form-inline my-2 my-lg-0">
                                <input className="form-control mr-sm-2"
                                    type="search" placeholder="Search"
                                    id="searchbox"
                                    value={sing_tag}
                                    onChange={(e) => setsing_tag(e.target.value)}
                                    aria-label="Search" />
                            </form>
                            </div>
                            <div className="postss">
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
                            </div>
                            <div className="container pt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-1 ">
                                    <Button disabled={!page_2} onClick={() => { if (page_2 > 0) { setpage_2(page_2- 1) } }}>Prev</Button>
                                </div>
                                <div className="col-md-1 d-flex">
                                    <Button disabled={!nextpage_counter_2} onClick={() => { setpage_2(page_2 + 1) }}>Next</Button>
                                </div>
                            </div>
                            <div className="row justify-content-center pt-5">
                                <form className="form-inline my-3 ">
                                    <label><h4 style={{ paddingLeft: '200px' }}>Enter the number of results per page : </h4></label>
                                    <input className="form-control mr-sm-2"
                                        type="search" placeholder="Number of results per page"
                                        value={tempnumber}
                                        onChange={(e) => settempnumber(e.target.value)}
                                        aria-label="Search" />
                                    <Button onClick={() => { setnumber_2(tempnumber) }}>Change</Button>
                                </form>
                            </div>
                        </div>


                            {<Tagscomponent />}

                            {<Tagpost />}

                        </div>
                    </Tab>
                </Tabs>








            </>


        );
    }
}