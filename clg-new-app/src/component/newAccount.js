import loginCss from "./login.module.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import CommonCss from "./commonCSS.module.css";

export default function NewAccount() {
  const [inputs, setInputs] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  function handleInput(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }
  const nameExp = /^[A-Za-z ]+$/;
  const userIdExp = /^[A-Za-z0-9@]+$/;
  const emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!nameExp.test(inputs.adminName)) {
      setShowDialog(true);
      setDialogMessage("Please check Admin name it only contain Character ");
      return;
    }

    if (!userIdExp.test(inputs.userId)) {
      setShowDialog(true);
      setDialogMessage(
        "Please check User It  it can not contain ! # $ % ^ & * ( ) _ - Character "
      );
      return;
    }
    if (!emailExp.test(inputs.email)) {
      setShowDialog(true);
      setDialogMessage(
        "Please check Email it can not   contain ! # $ % ^ & * ( ) = + Character "
      );
      return;
    }
    const requestData = {
      type: "admin",
      aname: inputs.adminName,
      userId: inputs.userId,
      email: inputs.email,
      apassword: inputs.apassword,
    };
    try{
          const response=await fetch("https://onlyserevr.onrender.com/demo", {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(response.ok){
          setShowDialog(true);
          setDialogMessage("Account created successfully");
        }else if(response.status === 400){
          setShowDialog(true);
          setDialogMessage("This account is already exist");
        }else{
          setShowDialog(true);
          setDialogMessage("Failed to created new account");
        }
    }catch(error){
      setShowDialog(true);
      setDialogMessage("Failed to created new account");
    }
    
  };

  return (
    <>
      <div className={loginCss.loginContainer}>
        <div className={loginCss.login}>
          <form onSubmit={handelSubmit}>
            <h2>Sign-Up</h2>

            <div className={loginCss.input}>
              <input
                type="text"
                name="adminName"
                onChange={handleInput}
                required
                placeholder="Enter Name"
              />
            </div>
            <div className={loginCss.input}>
              <input
                type="text"
                name="userId"
                onChange={handleInput}
                required
                placeholder="Enter UserId"
              />
            </div>
            <div className={loginCss.input}>
              <input
                type="text"
                name="email"
                onChange={handleInput}
                required
                placeholder="Enter Email"
              />
            </div>
            <div className={loginCss.input}>
              <input
                type="password"
                name="apassword"
                onChange={handleInput}
                required
                placeholder="Enter password"
              />
            </div>
            <div>
              <input
                className={loginCss.submit}
                type="submit"
                value="Sign-Up"
              />
            </div>
            <div>
              <Link to="/" className={loginCss.newaccount}>
                Login{" "}
              </Link>
            </div>
          </form>
          {showDialog && (
            <div className={CommonCss.dialog}>
              <div className={CommonCss.dialogContent}>
                <p>{dialogMessage}</p>
                <button onClick={() => setShowDialog(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
