import { useEffect, useState } from "react";
import OthersCss from "./others.module.css";
import CommonCss from "./commonCSS.module.css";
import EditCss from "./editStudent.module.css";

export default function Notice(){
    const [notice, setNotice]=useState({});
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [getnotice, setGetNotice]= useState([])
    
    function handelInputs(e){
        setNotice({
            ...notice,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const noticeData={
            type:'notice',
            notices:notice.notices
        }
        try{
            const response= await fetch('https://onlyserevr.onrender.com/demo',{
                method:'POST',
                body:JSON.stringify(noticeData),
                headers: {
                    "Content-Type": "application/json",
                  },

            })
            if(response.ok){
                setShowDialog(true);
                setDialogMessage('Notices send successfully')

            }else{
                setShowDialog(true);
                setDialogMessage('Notices send error')
            }
        }catch(error){
            setShowDialog(true);
            setDialogMessage('An error occured')
        }
    }

    const getNotices= async()=>{
        try{
            const reponse= await fetch('https://onlyserevr.onrender.com/noticeget',{
            method:'GET',
            headers: {
                "Content-Type": "application/json",
              },
             })
            const data= await reponse.json();
            setGetNotice(data);
        }catch(error){
            setShowDialog(true);
            setDialogMessage('An error occured')
        }
    }
    const deleteNotice= async(id)=>{
        try{
            const response= await fetch(`https://onlyserevr.onrender.com/noticedel/${id}`,{
                method:'DELETE'
            })
            if(response.ok){
                setShowDialog(true);
                setDialogMessage('Notices Deleted successfully')
            }else{
                setShowDialog(true);
                setDialogMessage('An error occured')
            }
            getNotices();
        }catch(error){
            setShowDialog(true);
            setDialogMessage('An error occured')
        }
    }
    useEffect(()=>{
        getNotices();
    },[])
    return(
        <>
            <div className={OthersCss.notice}>
            <h1 className={OthersCss.noticeS}>Notice</h1>
            <div className={OthersCss.noticeInpt}>
                <form onSubmit={handleSubmit}>
                    <input name='notices' type="text"  onChange={handelInputs} required placeholder="Enter Notice" className={OthersCss.inputs}></input>
                    <input type="submit"  className={OthersCss.inputsBtn}></input>
                </form>
                <div className={OthersCss.viewNotice}>
                    <ul className={EditCss.editList} >
                        {getnotice && getnotice.map((noticeD)=>{
                            
                            return(
                                <li className={EditCss.studentItem}>  
                                <div className={EditCss.name}>{noticeD.notices}</div>
                                <div>
                                    <button onClick={()=>deleteNotice(noticeD._id)}>Delete</button>
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
            </div>
        
        
        
        </>
    )
}