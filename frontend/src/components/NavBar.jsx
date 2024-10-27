import React from "react";
import { Button } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Failed, Success } from "../helper/popup";
import axiosInstance from "../api/axiosInterceptor";
import { logoutUser } from "../redux/slices/userAuth";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      navigate("/");
      Success("Logout successful");
    } catch (err) {
      console.log(err);
      Failed(err?.message);
    }
  };
  return (
    <div className="w-full h-300px bg-black flex justify-between items-center">
      <div className="text-white p-6">PDFUploader</div>
      <div>
        <Button className="bg-red-700 me-5" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
