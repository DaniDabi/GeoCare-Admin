import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import { db } from "./config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

function Users() {
  const [toggle, setToggle] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const data = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => (a.done ? 1 : -1)); // Sort by "done" field (true values come after false values)
      setReports(data);
      console.log(data);
    };
    getReports();
  }, []);

  const Toggle = () => {
    setToggle(!toggle);
  };

  const handleDoneReports = async (id) => {
    try {
      // update document in Firestore
      await updateDoc(doc(db, "reports", id), { done: true });
    } catch (error) {
      setError(error.message);
      console.error("Error updating report: ", error);
    }
  };
  return (
    <div className="container-fluid bg-secondary min-vh-100">
      <div className="row">
        {toggle && (
          <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
            <Sidebar />
          </div>
        )}
        {toggle && <div className="col-4 col-md-2"></div>}
        <div className="col">
          <div className="px-3">
            <Nav Toggle={Toggle} />
            <table className="table caption-top bg-white rounded mt-6">
              <caption className="text-white fs-4">Reports</caption>
              {error && <div className="alert alert-danger">{error}</div>}
              <thead>
                <tr>
                  <th scope="col">Date.</th>
                  <th scope="col">Report</th>
                  <th scope="col">Done?</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index}>
                    <td>{report.date}</td>
                    <td>{report.reportText}</td>
                    <td
                      className={
                        report.done ? "text-success" : "text-secondary"
                      }
                    >
                      {report.done ? "Done" : "Pending"}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDoneReports(report.id)}
                        disabled={report.done}
                      >
                        {report.done ? "Done" : "Mark as Done"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
