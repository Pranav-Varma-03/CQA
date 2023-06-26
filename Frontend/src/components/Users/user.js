import {  useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios";

import Profile from '../profile'

export default function User() {
    const { uid, username } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const dothis = async () => {
            await axios(`http://localhost:3001/users/${uid}/${username}`).then((res) => {
                //setid(res.data);
                console.log(11)
                console.log(res.data)
                if (res.data === 404) {
                    navigate('/users')
                }
                else {
                    navigate(`/users/${uid}/${res.data}`)
                }
                console.log(21)
            }).catch((e) => {
                console.log(e)
            })
        }
        dothis();
    }, [uid, username, navigate])

    return (
        <>
            <Profile id={uid} />
        </>
    )
};