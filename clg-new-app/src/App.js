import Login from "./component/login";
import NewAccount from "./component/newAccount";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./component/protected";
import RegisterStudent from "./component/registerStudent";
import AddBooks from "./component/addBooks";
import RegisterNovel from "./component/registerNovel";
import OthersDetails from "./component/others";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/newAccount" element={<NewAccount />}></Route>
          <Route
            path="/registerStudent"
            element={<Protected Component={RegisterStudent} />}
          ></Route>
          <Route
            path="/addBooks"
            element={<Protected Component={AddBooks} />}
          ></Route>
          <Route
            path="/registerNovel"
            element={<Protected Component={RegisterNovel} />}
          ></Route>

          <Route
            path="/others"
            element={<Protected Component={OthersDetails} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
