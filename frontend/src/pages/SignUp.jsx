import { useState, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { useFormik } from "formik";
import { signupValidation } from "../validation/validations";
import { Success, Failed } from "../helper/popup";

import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userAuth";

import axiosInstance from "../api/axiosInterceptor";

const initialValues = {
  email: "",
  password: "",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SignUp = () => {
  const dispatch = useDispatch();

  const {
    handleChange,
    values,
    errors,
    handleSubmit,
    handleBlur,
    touched,
    isSubmitting,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: signupValidation,
    onSubmit: async (values, action) => {
      try {
        const res = await axiosInstance.post("/user/signup", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = res.data.result;
        console.log(data);
        action.resetForm();
        Success(res.data.message);
      } catch (err) {
        Failed(err.response ? err.response.data.message : err.message);
        console.log(err.message);
      } finally {
        action.setSubmitting(false);
      }
    },
  });
  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full bg-gray-100">
        <div className=" bg-white shadow-lg max-w-md w-full">
          <div className="bg-white w-full p-8 h-full">
            {/* Login Form */}
            <h2 className="text-2xl font-semibold text-center mb-6">
              Register
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-0">
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your name"
                  className="mt-0 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.name && touched.name ? (
                  <div className="text-red-700 text-sm">{errors.name}</div>
                ) : (
                  <div className="text-white text-sm">l</div>
                )}
              </div>
              <div className="mb-0">
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  className="mt-0 block w-full p-3 border border-gray-300 rounded-md shadow-sm "
                />
                {errors.email && touched.email ? (
                  <div className="text-red-700 text-sm">{errors.email}</div>
                ) : (
                  <div className="text-white text-sm">Hello</div>
                )}
              </div>

              <div className="mb-0">
                <input
                  id="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className="mt-0 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-700 text-sm">{errors.password}</div>
                ) : (
                  <div className="text-white text-sm">l</div>
                )}
              </div>
              <div className="mb-0">
                <input
                  id="password2"
                  type="password"
                  value={values.password2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  className="mt-0 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                />
                {errors.password2 && touched.password2 ? (
                  <div className="text-red-700 text-sm">{errors.password2}</div>
                ) : (
                  <div className="text-white text-sm">l</div>
                )}
              </div>
              {isSubmitting ? (
                <Button
                  type="submit"
                  className="w-full bg-indigo-700 text-white py-3 shadow-md hover:bg-indigo-500 rounded-sm"
                  disabled
                >
                  registering...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-indigo-700 text-white py-3 shadow-md hover:bg-indigo-500 rounded-sm"
                >
                  Sign Up
                </Button>
              )}
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
