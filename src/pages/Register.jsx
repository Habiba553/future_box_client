import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Assume these functions exist on your AuthContext. Adjust names as needed.
  const {
    createUserWithEmailAndPasswordFunc,
    updateProfileFunc,
    sendEmailVerificationFunc,
    signInWithGoogle,
    setLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    return ""; // valid
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const displayName = e.target.name?.value?.trim();
    const photoURL = e.target.photo?.value?.trim();
    const email = e.target.email?.value?.trim();
    const password = e.target.password?.value || "";

    // password validation per requirement
    const pwError = validatePassword(password);
    if (pwError) {
      setPasswordError(pwError);
      return;
    }
    setPasswordError("");

    try {
      setLoading?.(true);
      // create user
      const res = await createUserWithEmailAndPasswordFunc(email, password);

      // update profile (if provided)
      try {
        await updateProfileFunc(displayName, photoURL);
      } catch (updateErr) {
        // non-fatal: show a toast but continue to send verification
        toast.warn("Profile update failed: " + (updateErr?.message || updateErr));
      }

      // send verification if your flow requires it
      try {
        await sendEmailVerificationFunc();
      } catch (verifyErr) {
        toast.warn("Sending verification email failed: " + (verifyErr?.message || verifyErr));
      }

      toast.success("Registration successful. Check your email to verify your account.");
      navigate("/auth/login");
    } catch (err) {
      // handle firebase-like errors where `code` exists
      if (err?.code === "auth/email-already-in-use") {
        toast.error("User already exists.");
      } else if (err?.code === "auth/weak-password") {
        toast.error("Password is too weak.");
      } else if (err?.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else {
        toast.error(err?.message || "Registration failed.");
      }
    } finally {
      setLoading?.(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading?.(true);
      await signInWithGoogle();
      toast.success("Signed in with Google");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Google sign-in failed.");
    } finally {
      setLoading?.(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/plants4.jpg')" }}
    >
      <div className="absolute inset-0 bg-green-950/60 backdrop-blur-sm"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-green-400/30 rounded-full blur-3xl top-16 left-12 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-green-600/20 rounded-full blur-3xl bottom-16 right-12 animate-pulse"></div>
      </div>

      <MyContainer>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center text-center lg:text-left gap-12 px-6 lg:px-20 py-10">
         

          <div className="w-full max-w-md bg-white/15 backdrop-blur-lg border border-green-200/30 shadow-2xl rounded-2xl p-8 flex flex-col gap-5 text-green-50 mt-20 lg:mt-20">
            <h2 className="text-3xl font-bold text-green-50 text-center mb-4">Register</h2>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-green-100/90 mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full bg-white/20 text-green-50 placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-4 py-2"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-green-100/90 mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  className="w-full bg-white/20 text-green-50 placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Photo URL */}
              <div className="flex flex-col">
                <label className="text-green-100/90 mb-1 text-sm">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  placeholder="Your photo URL (optional)"
                  className="w-full bg-white/20 text-green-50 placeholder-green-200/70 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-4 py-2"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-green-100/90 mb-1 text-sm">Password</label>
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="••••••"
                  className={`w-full bg-white/20 text-green-50 placeholder-green-200/70 focus:outline-none focus:ring-2 rounded-lg px-4 py-2 ${
                    passwordError ? "focus:ring-red-500 border border-red-500" : "focus:ring-green-400"
                  }`}
                />
                <span onClick={() => setShow(!show)} className="absolute right-4 top-9 cursor-pointer text-green-200/80">
                  {show ? <FaEye /> : <IoEyeOff />}
                </span>
                {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}

                {/* Password rules helper */}
                
              </div>

              <button type="submit" className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-lg mt-2 cursor-pointer">Register</button>

              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-16 bg-green-300/30"></div>
                <span className="text-sm text-green-200/70">or</span>
                <div className="h-px w-16 bg-green-300/30"></div>
              </div>

              <button type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 bg-white/10 text-green-50 px-5 py-2 rounded-lg w-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
                Continue with Google
              </button>

              <p className="text-center text-sm text-green-100/90 mt-3">
                Already have an account? {" "}
                <Link to="/auth/login" className="text-green-300 hover:text-green-200 underline font-semibold">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Register;