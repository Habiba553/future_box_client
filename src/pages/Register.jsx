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

    const pwError = validatePassword(password);
    if (pwError) {
      setPasswordError(pwError);
      return;
    }
    setPasswordError("");

    try {
      setLoading?.(true);
      const res = await createUserWithEmailAndPasswordFunc(email, password);
      const firebaseUser = res.user;

      try {
        await updateProfileFunc(displayName, photoURL);
      } catch (updateErr) {
        toast.warn("Profile update failed: " + (updateErr?.message || updateErr));
      }

      // --- SAVE USER TO MONGODB ---
      const newUser = { 
        name: displayName, 
        email: email, 
        uid: firebaseUser.uid,
        photo: photoURL 
      };

      fetch('https://moviemaster-server-kappa.vercel.app/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      .then(res => res.json())
      .then(data => {
        if(data.insertedId) {
           console.log('User saved to MongoDB');
        }
      });
      // ----------------------------

      try {
        await sendEmailVerificationFunc();
      } catch (verifyErr) {
        toast.warn("Sending verification email failed: " + (verifyErr?.message || verifyErr));
      }

      toast.success("Registration successful. Check your email to verify your account.", {
        autoClose: 2000,
      });
      navigate("/");
    } catch (err) {
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
      const res = await signInWithGoogle();
      const user = res.user;

      // --- SAVE GOOGLE USER TO MONGODB ---
      const newUser = { 
        name: user.displayName, 
        email: user.email, 
        uid: user.uid,
        photo: user.photoURL 
      };

      fetch('https://moviemaster-server-kappa.vercel.app/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      .then(res => res.json())
      .then(data => {
        if(data.insertedId) {
           console.log('Google user saved to MongoDB');
        }
      });
      // ----------------------------

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
      style={{
        backgroundImage: "url('https://t4.ftcdn.net/jpg/02/39/24/45/360_F_239244529_DvA47OXFQic9krRTFm49g9RUDPRTSIJV.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-[#24BAEF]/20 rounded-full blur-3xl top-16 left-12 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-[#1da1d1]/10 rounded-full blur-3xl bottom-16 right-12 animate-pulse"></div>
      </div>

      <MyContainer>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center text-center lg:text-left gap-12 px-6 lg:px-20 py-10">
          <div className="w-full max-w-md bg-white/15 backdrop-blur-lg border border-sky-200/30 shadow-2xl rounded-2xl p-8 flex flex-col gap-5 text-sky-50 mt-20 lg:mt-20">
            <h2 className="text-3xl font-bold text-sky-50 text-center mb-4">Register</h2>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sky-100/90 mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full bg-white/20 text-sky-50 placeholder-sky-200/70 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg px-4 py-2"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sky-100/90 mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  className="w-full bg-white/20 text-sky-50 placeholder-sky-200/70 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sky-100/90 mb-1 text-sm">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  placeholder="Your photo URL (optional)"
                  className="w-full bg-white/20 text-sky-50 placeholder-sky-200/70 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg px-4 py-2"
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-sky-100/90 mb-1 text-sm">Password</label>
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="••••••"
                  className={`w-full bg-white/20 text-sky-50 placeholder-sky-200/70 focus:outline-none focus:ring-2 rounded-lg px-4 py-2 ${
                    passwordError ? "focus:ring-red-500 border border-red-500" : "focus:ring-sky-400"
                  }`}
                />
                <span onClick={() => setShow(!show)} className="absolute right-4 top-9 cursor-pointer text-sky-200/80">
                  {show ? <FaEye /> : <IoEyeOff />}
                </span>
                {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
              </div>

              <button type="submit" className="bg-[#24BAEF] hover:bg-[#1da1d1] transition-all transform active:scale-[0.98] text-white font-semibold py-3 rounded-lg mt-2 cursor-pointer shadow-lg shadow-blue-500/20">Register</button>

              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px w-16 bg-sky-300/30"></div>
                <span className="text-sm text-sky-200/70">or</span>
                <div className="h-px w-16 bg-sky-300/30"></div>
              </div>

              <button type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 bg-white/10 text-sky-50 px-5 py-2 rounded-lg w-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
                Continue with Google
              </button>

              <p className="text-center text-sm text-sky-100/90 mt-3">
                Already have an account? {" "}
                <Link to="/auth/login" className="text-sky-300 hover:text-sky-200 underline font-semibold">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default Register;