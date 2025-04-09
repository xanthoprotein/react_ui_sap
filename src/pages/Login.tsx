import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hook";
import { login } from "../redux/slices/authSlice";
import PaypalLogo from "../assets/paypal2.png";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const handleLogin = async () => {
    console.log("email", email);
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await dispatch(login({ email })).unwrap();
      const { token, role, userId } = response;
      console.log("response from login", response);

      navigate("/chat");
    } catch (err: any) {
      setError(err.message || "Login failed, please try again.");
    }
  };

  return (
    <section className="h-[100vh] w-full flex flex-col items-center justify-center">
      <div className="rounded-xl bg-white flex flex-col justify-between items-center p-12 max-w-lg shadow-lg sm:w-[400px] lg:w-[500px] xl:w-[600px] border border-[#eaeced] ">
        <img src={PaypalLogo} alt="PayPal Logo" className="mb-5 w-40 h-auto" />
        <h3 className="mb-5 font-light ">
          Welcome to our PayPal AI Assistant platform! Please sign in to access
          your account and get started
        </h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6 p-3 w-full border border-[#CCCCCC] rounded-lg h-12 focus:outline-none focus:border-[#0551b5] transition-colors duration-300"
        />

        <button
          onClick={handleLogin}
          disabled={inProgress}
          className="w-full h-12 flex justify-center items-center  bg-primary rounded-lg text-white hover:opacity-80"
          data-ai-id="Sign In - button"
        >
          {inProgress ? "Loading" : "Sign In"}
        </button>
      </div>
    </section>
  );
};

export default LoginPage;
