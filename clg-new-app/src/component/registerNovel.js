import { Link, useNavigate } from "react-router-dom";
import mainCss from "./main.module.css";
import NowelReg from "./novel.module.css";
import { useState } from "react";
import CommonCss from "./commonCSS.module.css";
import NovelsEdit from "./novelsEdit";

export default function RegisterNovel() {
  const [success, setSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [file, setFile] = useState(null);

  const [inputnowel, setInputNowe] = useState({
    title: " ",
    author: "",
    isbn: "",
    file: null,
  });

  function handleInput(e) {
    setInputNowe({
      ...inputnowel,
      [e.target.name]: e.target.value,
    });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setInputNowe({
      ...inputnowel,
      file: file,
    });
  };

  //Exp for checking a Character format
  const nameExp = /^[A-Za-z ]+$/;

  // Regular expression for validating 10-digit ISBN
  const isbn10Regex = /^(?:\d{9}[\dXx])$/;

  // Regular expression for validating 13-digit ISBN
  const isbn13Regex = /^(?:\d{13})$/;
  //const selectedFile = inputnowel.file;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameExp.test(inputnowel.title)) {
      setShowDialog(true);
      setDialogMessage("Please check title  it only contain Character ");

      return;
    }
    if (!nameExp.test(inputnowel.author)) {
      setShowDialog(true);
      setDialogMessage("Please check author  it only contain Character ");

      return;
    }
    if (
      !(isbn10Regex.test(inputnowel.isbn) || isbn13Regex.test(inputnowel.isbn))
    ) {
      setShowDialog(true);
      setDialogMessage("Invalid ISBN format");

      return;
    }
    const selectedFile = inputnowel.file;
    if (selectedFile.type !== "application/pdf") {
      setShowDialog(true);
      setDialogMessage("Only PDF files are allowed.");
      return;
    }

    //check size of file
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setShowDialog(true);
      setDialogMessage("File size exceeds 10 MB limit.");

      return;
    }
    const formData = new FormData();
    formData.append("type", "nowel");
    formData.append("title", inputnowel.title);
    formData.append("author", inputnowel.author);
    formData.append("isbn", inputnowel.isbn);
    formData.append("file", inputnowel.file);

    try {
      const response = await fetch("https://onlyserevr.onrender.com/demo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const nowelData = await response.json();

        setSuccess(true);
      } else if (response.status === 400) {
        setShowDialog(true);
        setDialogMessage("This Novel has  been already added ");
      } else {
        setShowDialog(true);
        setDialogMessage("Failed to add Novel ");
      }
    } catch (error) {
      console.log(error);
      setShowDialog(true);
      setDialogMessage(
        "An error occurred while adding the Novel or the server is not running",
        error
      );
    }
  };
  const handleCloseDialog = () => {
    setSuccess(false);
  };

  const navigate = useNavigate();
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
              {/* <a href='./registerStudent.js'>Student Register</a> */}
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
        <div className={NowelReg.nowelSectioon}>
          <p className={NowelReg.addNowels}>Novels Registration</p>
          <div className={NowelReg.nowels}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                name="title"
                onChange={handleInput}
                type="text"
                placeholder="Title"
                required
                className={NowelReg.input}
              ></input>
              <input
                name="author"
                onChange={handleInput}
                type="text"
                placeholder="Author"
                required
                className={NowelReg.input}
              ></input>
              <input
                name="isbn"
                onChange={handleInput}
                type="text"
                placeholder="ISBN"
                required
                className={NowelReg.input}
              ></input>
              <input
                name="file"
                onChange={handleFileChange}
                type="file"
                accept="application/pdf"
                required
                className={NowelReg.file}
              ></input>
              <p className={NowelReg.pdf}>
                <sup>*</sup>Only PDF file allowd! Size will be 10MB
              </p>
              <input className={NowelReg.sub} type="submit"></input>
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
          {success && (
            <div className={CommonCss.dialog}>
              <div className={CommonCss.dialogContent}>
                <p>Novel added successfully!</p>
                <button onClick={handleCloseDialog}>Close</button>
              </div>
            </div>
          )}
          <div>
            <NovelsEdit></NovelsEdit>
          </div>
        </div>
      </section>
    </>
  );
}
