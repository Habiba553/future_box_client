import React, { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [show, setShow] = useState(false);
  const { signInUser, signInWithGoogle, sendPassResetEmailFunc, setLoading, setUser, user } = useContext(AuthContext);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const emailRef = useRef(null);

  if (user) {
    navigate("/");
    return null;
  }

  const handleLogIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading?.(true);

    signInUser(email, password)
      .then((result) => {
        setLoading?.(false);
        setUser?.(result.user);
        toast.success("Login successful");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setLoading?.(false);
        toast.error(error.message || "Login failed");
      });
  };

  const handleGoogleSignIn = () => {
    setLoading?.(true);

    signInWithGoogle()
      .then((result) => {
        setLoading?.(false);
        setUser?.(result.user);
        toast.success("Login successful");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setLoading?.(false);
        toast.error(error.message || "Google login failed");
      });
  };

  const handleForgetPassword = () => {
    const email = emailRef.current?.value;
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setLoading?.(true);

    sendPassResetEmailFunc(email)
      .then(() => {
        setLoading?.(false);
        toast.success("Check your email to reset your password");
      })
      .catch((error) => {
        setLoading?.(false);
        toast.error(error.message || "Password reset failed");
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/plants4.jpg')" }}
    >
      {/* Soft dark overlay */}
      <div className="absolute inset-0 bg-green-950/60 backdrop-blur-sm"></div>

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-green-400/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-green-600/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>
      </div>

      <MyContainer>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 md:px-12 lg:px-24 w-full">
          

          {/* Login card */}
          <div className="w-full max-w-md bg-white/15 backdrop-blur-lg border border-green-200/30 shadow-2xl rounded-2xl p-8 flex flex-col gap-5 text-green-50 mt-20 lg:mt-20">
            <h2 className="text-3xl font-bold text-green-50 text-center mb-4">Login</h2>

            <form onSubmit={handleLogIn} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-green-100/90 mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  placeholder="you@example.com"
                  className="w-full bg-white/20 text-green-50 placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-green-100/90 mb-1 text-sm">Password</label>
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="••••••"
                  className="w-full bg-white/20 text-green-50 placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-4 py-2"
                  required
                />
                <span
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-9 cursor-pointer text-green-200/80"
                >
                  {show ? <FaEye /> : <IoEyeOff />}
                </span>
              </div>

              <button
                type="button"
                onClick={handleForgetPassword}
                className="self-end text-sm text-green-300 hover:text-green-200 underline cursor-pointer"
              >
                Forgot password?
              </button>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-lg mt-2 cursor-pointer"
              >
                Login
              </button>

              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-16 bg-green-300/30"></div>
                <span className="text-sm text-green-200/70">or</span>
                <div className="h-px w-16 bg-green-300/30"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 bg-white/10 text-green-50 px-5 py-2 rounded-lg w-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className="w-5 h-5"
                />
                Login with Google
              </button>

              <p className="text-center text-sm text-green-100/90 mt-3">
                New to our website? {" "}
                <Link
                  to="/auth/register"
                  className="text-green-300 hover:text-green-200 underline font-semibold"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Login;
