import React, { useState, useEffect } from "react";
import studentCss from "./registerStudent.module.css";
import { Link, useNavigate } from "react-router-dom";
import mainCss from "./main.module.css";
import EditDtusent from "./editStudent";
import CommonCss from "./commonCSS.module.css";

//import DropdownExample from './clsSelect';
export default function RegisterStudent() {
  const navigate = useNavigate();
  useEffect(() => {
    // Navigate to the "Others" page when the Main component is mounted
    navigate("/registerStudent");
  }, [navigate]);

  const [inputs, setInputs] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const options = [
    { label: "FYCS", value: "FYCS" },
    { label: "SYCS", value: "SYCS" },
    { label: "TYCS", value: "TYCS" },
    { label: "FYIT", value: "FYIT" },
    { label: "SYIT", value: "SYIT" },
    { label: "TYIT", value: "TYIT" },
  ];

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const nameExp = /^[A-Za-z ]+$/;

  function handleInput(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
    console.log(inputs);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameExp.test(inputs.stuName)) {
      setShowDialog(true);
      setDialogMessage("Please check student name it only contain Character ");
      return;
    }
    const requestData = {
      type: "student",
      clas: selectedValue,
      stuName: inputs.stuName,
      user: inputs.user,
      password: inputs.password,
    };

    //https://admin-ehvj.onrender.com/demo
    await fetch("https://onlyserevr.onrender.com/demo", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.studentData) {
          setShowDialog(true);
          setDialogMessage("Student registered successfully!");
        } else if (data.error === "This Student has been already added") {
          setShowDialog(true);
          setDialogMessage("This student is already registered.");
        } else {
          setShowDialog(true);
          setDialogMessage("Failed to register student.");
        }
      })
      .catch((error) => {
        setShowDialog(true);
        setDialogMessage("An error occurred while registering the student.");
      });
  };
  //navigate define in line no 10
  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      <nav className={mainCss.mainNav}>
        <div className={mainCss.logo}>
          <h2>
            <span>L</span>ibrary
            <span>A</span>dmin
          </h2>
        </div>
        <div className={mainCss.manuLink}>
          <ul>
            <li>
              <Link to="/registerStudent">Student Register</Link>
            </li>
            <li>
              <Link to="/addBooks">BooK Register</Link>
            </li>
            <li>
              <Link to="/registerNovel">Novel Register</Link>
            </li>
            <li>
              <Link to="/others">Others</Link>
            </li>
            <li>
              <button onClick={logout} className={mainCss.logConfig}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <section>
        <div className={studentCss.studentSection}>
          <div>
            <select
              value={selectedValue}
              onChange={handleDropdownChange}
              className={studentCss.select}
            >
              <option value="">Select Class..</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={studentCss.cls}>
            <p className={studentCss.class}>{selectedValue}</p>
          </div>

          <div className={studentCss.student}>
            <p className={studentCss.register}>Register Student</p>
            {/* <div className="dropdown-container">
              <DropdownExample />
            </div> */}
            <form onSubmit={handleSubmit}>
              <input
                name="clas"
                onChange={handleInput}
                type="text"
                value={selectedValue}
                placeholder="Class Name"
                required
              ></input>
              <input
                name="stuName"
                onChange={handleInput}
                type="text"
                placeholder="Student Name"
                required
              ></input>
              <input
                name="user"
                onChange={handleInput}
                type="text"
                placeholder="User Name"
                required
              ></input>
              <br></br>
              <input
                name="password"
                onChange={handleInput}
                type="text"
                placeholder="Password"
                required
                className={studentCss.input}
              ></input>
              <br></br>
              <input className={studentCss.sub} type="submit"></input>
            </form>
          </div>

          {showDialog && (
            <div className={CommonCss.dialog}>
              <div className={CommonCss.dialogContent}>
                <p>{dialogMessage}</p>
                <button onClick={() => setShowDialog(false)}>Close</button>
              </div>
            </div>
          )}
          <div>
            <EditDtusent
              selectedValue={selectedValue}
              type="student"
            ></EditDtusent>
          </div>
        </div>
      </section>
    </>
  );
}
