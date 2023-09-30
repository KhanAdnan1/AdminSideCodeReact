
import React, { useState } from 'react';
import addCss from './addBooks.module.css';
import { Link,useNavigate  } from 'react-router-dom';
import mainCss from './main.module.css';
import EditDtusent from './editStudent';
import CommonCss from './commonCSS.module.css'

export default function AddBooks() {
  const [selectedValue, setSelectedValue] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);

  const [book, setBook] = useState({
    clas: selectedValue.trim(),
    title: '',
    isbn: '',
    file: null,
  });
  
  const options = [
    { label: 'FYCS', value: 'FYCS' },
    { label: 'SYCS', value: 'SYCS' },
    { label: 'TYCS', value: 'TYCS' },
    { label: 'FYIT', value: 'FYIT' },
    { label: 'SYIT', value: 'SYIT' },
    { label: 'TYIT', value: 'TYIT' },
    
  ];

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
    
  };


  // Regular expression for validating 10-digit ISBN
  const isbn10Regex = /^(?:\d{9}[\dXx])$/;

  // Regular expression for validating 13-digit ISBN
  const isbn13Regex = /^(?:\d{13})$/;

  function handleInputs(e) {
    setBook({
      ...book,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setBook({
      ...book,
      file: file
    });
  };

  const handleSubmits = async (e) => {
    e.preventDefault();
    
    if (!(isbn10Regex.test(book.isbn) || isbn13Regex.test(book.isbn))) {
      setError('Invalid ISBN format');
      return;
    } 

    //check size of file 
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 10 MB limit.');
      return;
    }

    const selectedFile = book.file;
        if (selectedFile.type !== 'application/pdf') {
          setError('Only PDF files are allowed.');
          return;
          }
    const formData = new FormData();
    formData.append('type', 'book');
    formData.append('clas', selectedValue.trim());
    formData.append('title', book.title);
    formData.append('isbn', book.isbn);
    formData.append('file', book.file);

    try {
      const response = await fetch('https://onlyserevr.onrender.com/demo', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const bookData = await response.json();
        
        setSuccess(true);
      } else if (response.status === 400) {
        setError('This book has  been already added');
      } else {
        setError('Failed to add book');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while adding the book or the server is not running',error);
    }
  }

  const handleCloseDialog = () => {
    setError(null);
    setSuccess(false);
  };
  const navigate =useNavigate();
    function logout(){
        localStorage.clear();
        navigate('/');

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
             <div  className={mainCss.manuLink}>
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
                  <li >
                    <button onClick={logout} className={mainCss.logConfig}>Sign out</button>
                  </li>
                </ul>
             </div>
        </nav>
        <section>
        <div className={addCss.bookSection}>

        
        <div >
            <select value={selectedValue} onChange={handleDropdownChange} className={addCss.select}>
              <option value="">Select Class..</option>
              {options.map((option) => (
                <option key={option.value} value={option.value} >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        <div className={addCss.cls}>
          <p className={addCss.class}>{selectedValue}</p>
        </div>
          <div className={addCss.books}>
            <p className={addCss.addBooks}>Add Books</p>
            <form onSubmit={handleSubmits} encType="multipart/form-data">
              <input name='clas' onChange={handleInputs} type='text' value={selectedValue.trim()} placeholder='Class Name' required className={addCss.input}></input>
              <input name='title' onChange={handleInputs} type='text' placeholder='Title' required className={addCss.input}></input><br></br>
              <input name='isbn' onChange={handleInputs} type='text' placeholder='ISBN' required className={addCss.input}></input><br></br>
              <input name='file' onChange={handleFileChange} type='file' accept="application/pdf" required className={addCss.file}></input>
              <p className={addCss.pdf}><sup>*</sup>Only PDF file allowd! Size will be 10MB</p>
              <input className={addCss.sub} type='submit'></input>
              
            </form>
          </div>
          {error && (
            <div className={CommonCss.dialog}>
              <div className={CommonCss.dialogContent}>
                <p>{error}</p>
                <button onClick={handleCloseDialog}>Close</button>
              </div>
            </div>
          )}
          {success && (
            <div className={CommonCss.dialog}>
              <div className={CommonCss.dialogContent}>
                <p>Book added successfully!</p>
                <button onClick={handleCloseDialog}>Close</button>
              </div>
            </div>
          )}
          <div>
        <EditDtusent selectedValue={selectedValue} type="book"></EditDtusent>
        </div>
      </div>
      </section>
    </>
  )
}



