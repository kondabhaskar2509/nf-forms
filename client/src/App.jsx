import React from "react";
import {Route , Routes } from "react-router-dom";

import Home from "./pages/Home.jsx";
import DAuthCallback from "./pages/DAuthCallback.jsx";
import Profile from "./pages/Profile.jsx";
import CreateForm from "./pages/CreateForm.jsx";
import FormResponse from "./pages/FormResponse.jsx";
import EditForm from "./pages/EditForm.jsx";

const App = () => {
  return (
    <>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<DAuthCallback />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/createform" element={<CreateForm />} />
      <Route path="/form/:id" element={<FormResponse />} />
      <Route path="/edit-form/:id" element={<EditForm />} />
     </Routes>
    </>
  )
}

export default App