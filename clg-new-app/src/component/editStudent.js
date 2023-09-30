import EditCss from "./editStudent.module.css";
import { useEffect, useState } from "react";
import CommonCss from "./commonCSS.module.css";

export default function EditDtusent({ selectedValue, type }) {
  const [studentData, setStudentData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const deleteBtn = async (id) => {
    console.log(`${type === "book"}, ${id}`);
    try {
      let apiUrl = "";

      if (type === "student") {
        apiUrl = `https://onlyserevr.onrender.com/deletestu/${id}`;
      } else if (type === "book") {
        // Adjust the URL for deleting books
        apiUrl = `https://onlyserevr.onrender.com/deletebook/${id}`;
      }
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDialog(true);
        setDialogMessage(
          `${type === "student" ? "Student" : "Book"} Deleted successfully!`
        );
        // Delete was successful, update the studentData state.
        fetchStudent();
      } else {
        // Handle the case where the delete request was not successful.
        //console.error('Error deleting Student:', response.statusText);
        console.error(
          `Error deleting ${type === "student" ? "Student" : "Book"}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        `Error deleting ${type === "student" ? "Student" : "Book"}:`,
        error
      );
      setShowDialog(true);
      setDialogMessage(
        `Failed to Delete ${type === "student" ? "student" : "book"}.`
      );
    }
  };

  const fetchStudent = async (id) => {
    let apiUrls = "";
    try {
      if (type === "student") {
        apiUrls = `https://onlyserevr.onrender.com/students/${selectedValue}`;
      } else if (type === "book") {
        apiUrls = `https://onlyserevr.onrender.com/books/${selectedValue}`;
      }

      const response = await fetch(apiUrls, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Error fetching data:", response.statusText);
        return;
      }
      const data = await response.json();
      console.log(data);
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (selectedValue) {
      fetchStudent();
    }
  }, [selectedValue]);

  return (
    <>
      <div className={EditCss.edit}>
        <ul className={EditCss.editList}>
          {Array.isArray(studentData) &&
            studentData.map((item) => (
              <li key={item._id} className={EditCss.studentItem}>
                {type === "student" && (
                  <>
                    <div className={EditCss.name}>{item.user}</div>
                    <div className={EditCss.userID}>{item.stuName}</div>
                  </>
                )}
                {type === "book" && (
                  <>
                    <div className={EditCss.name}>{item.title}</div>
                    <div className={EditCss.userID}>{item.isbn}</div>
                  </>
                )}
                <div className={EditCss.btn}>
                  <button onClick={() => deleteBtn(item._id)}>Delete</button>
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
