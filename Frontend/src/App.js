import { Component } from "react";

import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import UserContext from "./components/auth/Auth";

import Login from "./components/login";

import Home from "./components/home";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Users from "./components/Users/users";

import User from "./components/Users/user";

import Post from "./components/Posts/post";

import Posts from "./components/Posts/posts";

import Createpost from "./components/Posts/create_post";
import Tags from "./components/Tags/tags";
import Tagposts from "./components/Posts/tags_posts";
import Editpost from "./components/Posts/edit_post";
import Register from "./components/register";

export default class App extends Component {

   constructor(props){
      super(props);
      this.state = {
         
      }
   }

   render() {
      return (
         <>
            <Router>
               <UserContext>
                  <Routes>
                        <Route index element={<Navigate to='/login'/>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register/>}/>
                        <Route element={<ProtectedRoute/>} >
                           <Route path="/home" element={<Home/>} />
                           <Route path="/tags" element={<Tags/>}/>
                           <Route path="/tagged" >
                              <Route path=":tag_name" element={<Tagposts/>}/>
                           </Route>
                           <Route path="/users" element={<Users/>} >
                              <Route path=":uid/:username" element={<User/>}/>
                           </Route>
                           <Route path="/posts" element={<Posts/>} >
                              <Route path=":postid/:postname" element={<Post/>}/>
                           </Route>
                           <Route path="/newpost" element={<Createpost/>}/>
                           <Route path="/editpost">
                              <Route path=":postid/:postname" element={<Editpost/>}/>
                           </Route> 
                        </Route>
                        <Route path="*" element={<h1>Page not found 404</h1>} />
                  </Routes>
               </UserContext>
            </Router>
         </>
      )
   };
}
