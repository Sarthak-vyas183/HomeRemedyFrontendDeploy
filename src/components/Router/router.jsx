/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SignUp from '../pages/SignUp';
import Login from '../pages/login';
import Remedies from '../pages/Remedies';
import RemedyForm from '../pages/RemedyForm';
import Logout from '../pages/logout';
import Profile from '../pages/Profile';
import User from "../pages/User"
import MyRemedy from '../pages/MyRemedy';
import SpecialistContact from '../pages/SpecialistContact';
import Bookmarks from '../pages/Bookmarks';
import Admin from "../Admin/Admin"
import Usermanagement from "../Admin/Admin_userManagement"
import RemedyManagement from "../Admin/Admin_remedyManagement"
import IsDoctor from "../IsDoctor/IsDoctor";
import Users_Requests from "../IsDoctor/Users_Requests";
import Verify_Remedy from '../IsDoctor/Verify_remedy';
import RemedyDetail from '../pages/RemedyDetail';
import VerificationReq from '../Admin/verificationReq';

function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/remedies" element={<Remedies />} />
        <Route path="/create" element={<RemedyForm/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path='/remedy/:id' element={<RemedyDetail/>} /> 
 

        <Route path='/user' element={<User/>}>
             <Route path='create' element={<RemedyForm/>} />
             <Route path='profile' element={<Profile/>} />
             <Route path='myremedy' element={<MyRemedy/>} />
             <Route path='contact' element={<SpecialistContact/>} />
             <Route path='bookmarks' element={<Bookmarks/>} />
        </Route> 


        <Route path='/admin' element={<Admin/>}>
             <Route path='create' element={<RemedyForm/>} />
             <Route path='profile' element={<Profile/>} />
             <Route path='myremedy' element={<MyRemedy/>} />
             <Route path='bookmarks' element={<Bookmarks/>} />
             <Route path='usermanagement' element={<Usermanagement/>} />
             <Route path='remedymanagement' element={<RemedyManagement/>} />
             <Route path='verifyReq' element={<VerificationReq/>} />
        </Route> 

        <Route path='/professional' element={<IsDoctor/>}>
             <Route path='create' element={<RemedyForm/>} />
             <Route path='profile' element={<Profile/>} />
             <Route path='myremedy' element={<MyRemedy/>} />
             <Route path='requests' element={<Users_Requests/>} />
             <Route path='verifyremedy' element={<Verify_Remedy/>} />
             <Route path='bookmarks' element={<Bookmarks/>} />
        </Route> 
       
  
      </Routes>
    </div>
  );
}

export default Router;
