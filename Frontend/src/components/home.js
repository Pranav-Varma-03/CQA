import Profile from "./profile";
import Cookies from "js-cookie";

const Home = () => {

    const ecookie = Cookies.get('User')



    return (
        <>



            <Profile id={ecookie} />


        </>
    )
};

export default Home;