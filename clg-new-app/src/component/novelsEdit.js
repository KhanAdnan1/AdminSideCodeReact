import { useEffect, useState } from "react";
import EditCss from "./editStudent.module.css";
import CommonCss from "./commonCSS.module.css";

export default function NovelsEdit() {
  const [novelsData, setNovelsData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const fetchNovelsData = async () => {
    try {
      //https://onlyserevr.onrender.com/getallnovels
      const response = await fetch(
        "https://onlyserevr.onrender.com/getallnovels",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching novels data:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data);
      setNovelsData(data.novelsData);
    } catch (error) {
      console.error("Error fetching novels data:", error);
    }
  };

  useEffect(() => {
    fetchNovelsData();
  }, []);

  const deleteBtn = async (isbn) => {
    console.log(isbn);
    try {
      //`https://onlyserevr.onrender.com/deletegetnovels/${isbn}`
      const response = await fetch(
        `https://onlyserevr.onrender.com/deletegetnovels/${isbn}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setShowDialog(true);
        setDialogMessage("Nowel Deleted successfully!");
        fetchNovelsData();
      } else {
        setShowDialog(true);
        setDialogMessage("Error  deleting Nowel ");
      }
    } catch (error) {
      console.error("Error deleting  Novel", error);
      setShowDialog(true);
      setDialogMessage("Failed to Delete Novel");
    }
  };

  return (
    <>
      <div className={EditCss.edit}>
        <ul className={EditCss.editList}>
          {novelsData &&
            novelsData.map((novel) => (
              <li key={novel.isbn} className={EditCss.studentItem}>
                <div className={EditCss.name}>{novel.title}</div>
                <div className={EditCss.userID}>{novel.isbn}</div>
                <div className={EditCss.btn}>
                  <button onClick={() => deleteBtn(novel.isbn)}>Delete</button>
                </div>
              </li>
            ))}
        </ul>
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
  );
}
