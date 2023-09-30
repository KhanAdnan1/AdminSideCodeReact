//import Main from './main';
import loginCss from "./login.module.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterStudent from "./registerStudent";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [inputs, setInputs] = useState({
    userId: "",
    apassword: "",
  });

  const [loginError, setLoginError] = useState("");

  function handleInput(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      userId: inputs.userId,
      apassword: inputs.apassword,
    };
   
    try {
      const response = await fetch(
        "https://onlyserevr.onrender.com/login-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === "ok" && data.data) {
          // Set loggedIn state to true
          localStorage.setItem("login", "true");

          setLoggedIn(true);
          window.location.replace("/registerStudent");
        } else {
          // Failed login, handle the error
          setLoginError("Invalid User and Password");
        }
      } else {
        // Failed login, handle the error
        setLoginError("Invalid User and Password");
      }
    } catch (error) {
      console.error("check server");
      // Handle any other errors here
    }
  };

  if (loggedIn) {
    return <RegisterStudent />;
  }

  return (
    <>
      <div className={loginCss.loginContainer}>
        <div className={loginCss.login}>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className={loginCss.input}>
              <input
                type="text"
                name="userId"
                onChange={handleInput}
                required
                placeholder="User ID"
              />
            </div>
            <div className={loginCss.input}>
              <input
                type="password"
                name="apassword"
                onChange={handleInput}
                required
                placeholder="Password"
              />
            </div>
            <div>
              <input className={loginCss.submit} type="submit" value="Login" />
            </div>
            {loginError && <p>{loginError}</p>}
            <div>
              <Link to="/newAccount" className={loginCss.newaccount}>
                Create New Account{" "}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
