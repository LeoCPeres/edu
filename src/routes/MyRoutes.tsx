import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { ResetPassword } from "../pages/Auth/ResetPassword";
import { Home } from "../pages/Home/Home";
import { Navbar } from "../components/Navbar";
import { RegisterTeacher } from "../pages/Teachers/Register";
import { Flex } from "@chakra-ui/react";
import { Teachers } from "../pages/Teachers";
import { Profile } from "../pages/Profile";
import { EditTeacher } from "../pages/Teachers/Edit";

export function MyRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        <Route path="/teacher/register" element={<RegisterTeacher />} />
        <Route path="/teachers/edit" element={<EditTeacher />} />
        <Route path="/teachers" element={<Teachers />} />

        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<Profile />} />

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
