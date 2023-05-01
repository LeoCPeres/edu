import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import { ResetPassword } from "../pages/Auth/ResetPassword";
import { Home } from "../pages/Home/Home";
import { Navbar } from "../components/Navbar";

export function MyRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
