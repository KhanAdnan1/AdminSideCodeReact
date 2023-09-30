import { Link, useNavigate } from "react-router-dom";
import OthersCss from "./others.module.css";
import mainCss from "./main.module.css";
import Notice from "./notice";
import CommonCss from "./commonCSS.module.css";
import { useEffect, useState } from "react";

export default function OthersDetails() {
  const[img,setImg]=useState(null)
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [imgData, setImageDat]=useState('');

  function handleImage(e){
    var reader= new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload=()=>{
          setImg(reader.result)
    }
    reader.onerror=error=>{
      console.log('Error',error);
    }
   ;
   
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const image = new Image();
    image.src = img;
  
    image.onload = () => {
      if (image.width !== 350 || image.height !== 250) {
        setShowDialog(true);
        setDialogMessage("Image dimensions should be 350x250 pixels.");
      } else {
        
        try {
          fetch("https://onlyserevr.onrender.com/images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              base64: img,
            }),
          })
            .then((response) => {
              if (response.ok) {
                setShowDialog(true);
                setDialogMessage("Added successfully");
              } else {
                setShowDialog(true);
                setDialogMessage("An error occurred");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    image.onerror = (error) => {
      console.log("Error loading image", error);
      setShowDialog(true);
      setDialogMessage("Only imagge are allowed ");
    };
  };
  
  

  const getImage= async() =>{
    try{
      const response=await fetch('https://onlyserevr.onrender.com/image',{
        method:'GET',
        
      }).then((res)=> res.json()).then((data)=>{
        
        setImageDat(data.data);
      })
    }catch (error){
      console.log(error);
    }

  }

  const deleteBtn =async(id)=>{
    try{
      const respone = await fetch(`https://onlyserevr.onrender.com/deleimg/${id}`,{
        method:'DELETE'
      })
      if(respone.ok){
        setShowDialog(true);
        setDialogMessage("Deleted successfully");
      }
      getImage();
    }catch(error){
      setShowDialog(true);
      setDialogMessage("Failed to Delete Image");
    }

  }

  useEffect(()=>{
    getImage();
  },[])
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
              
            </li>
            <li>
              <Link to="/addBooks">BooK Register</Link>
            </li>
            <li>
              <Link to="/registerNovel">Novel Register</Link>
            </li>
            <li>
              <Link to="/others">Other</Link>
            </li>
            <li>
              <button onClick={logout} className={mainCss.logConfig}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
        <div></div>
      </nav>
      <section>
        <div className={OthersCss.othersSection}>
        <div className={OthersCss.photo}>
          <h1 className={OthersCss.addPhoto}>Add Photo</h1>
          <div className={OthersCss.image}>
            <form onSubmit={handleSubmit}>
                  <input name='file' type="file"  onChange={handleImage} required className={OthersCss.imgInp}></input> 
                  <input  type="submit" className={OthersCss.imgSub}></input>
            </form>
          </div>
          <div className={OthersCss.imgView}>
              <ul className={OthersCss.editList}>
                {imgData && imgData.map(data=>{
                  return(
                    <li className={OthersCss.imgtItem}>
                      <div className={OthersCss.imgSrc}><img width={400}  src={data.img}></img></div>
                      <div>
                        <button  onClick={()=> deleteBtn(data._id)} className={OthersCss.delBtn} >Delete</button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
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
          <Notice></Notice>
          </div>
        </div>
      </section>
    </>
  );
}
