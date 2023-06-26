import axios from "axios";
import { useEffect, useState } from "react"
import { Link, Outlet, useParams } from "react-router-dom"
import { Button } from "react-bootstrap";
import '../Users/users.css'

export default function Users() {

    const [tempnumber, settempnumber] = useState(10);

    const [user_data, setdata] = useState([]);
    const [page, setpage] = useState(0);
    const [number, setnumber] = useState(10);
    const data_id = useParams().uid;
    const data_name = useParams().username;
    const [nextpage_counter, setit] = useState(1);



    const [search, setsearch] = useState('');

    useEffect(() => {
        const dothis = async () => {
            await axios.get(`http://localhost:3001/users?page=${page}&number=${number}&search=${search}`).then((res) => {
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
            })
        }

        dothis();

    }, [search, number, page])


    if (data_id && data_name) {
        return (
            <Outlet />
        )
    }
    else {
        return (
            <>
                <div className="container pt-5 pl-5 d-flex">
                    <h1>Search User</h1>
                </div>

                <div className="container justify-content-center pt-3 pl-5">

                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2"
                            type="search" placeholder="Username"
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                            aria-label="Search" />
                    </form>
                </div>


                <div className="container my-3">
                    <div  className="row">
                        {
                            user_data.map((one) => (
                                <div className="col-md-4" key={one.user_id}>
                                    <div className='container d-flex justify-content-center pt-3'>
                                        <div className='card' id="alg" style={{ width: "300px", height: "40px" }}>
                                            <div className='row  g-0'>
                                                <div className='col-md-1'>
                                                </div>
                                                <div  className='col-md-9'>

                                                    <Link to={`${one.user_id}/${one.username}`} className="pt-1 mt-2" style={{ marginTop: "40px", marginLeft: "10px" }}>{one.username}</Link>
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
                        <div className="col-md-1 ">
                            <div className="prevB">
                            <Button disabled={!page} onClick={() => { if (page > 0) { setpage(page - 1) } }}>Prev</Button>
                            </div>
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


            </>
        )
    }
};