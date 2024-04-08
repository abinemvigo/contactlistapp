import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Formtable from './components/Formtable';
import log from 'loglevel';
axios.defaults.baseURL = "http://localhost:3002/api";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    _id: ""
  });
  const [dataList, setDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.post("/contacts", formData);
      if (data.data.success) {
        setAddSection(false);
        toast.success(data.data.message);
        getFetchData();
      }
    } catch (error) {

      log.error(error)
      toast.error(error.response.data.message || "Something Went wrong please try again")
    }

  };

  const getFetchData = async () => {
    try {
      const { data } = await axios.get(`/contacts?search=${searchQuery}&page=${currentPage}`);
      if (data.payload.contacts) {
        setDataList(data.payload.contacts);
        setTotalPages(data.payload.pagination.totalPages);
      }
    } catch (error) {
      log.error(error)

      toast.error(error.response.data.message || "Something Went wrong please try again")

    }
  };

  useEffect(() => {
    getFetchData();
  }, [currentPage, searchQuery]);

  const handleDelete = async (id) => {
    try {
      const data = await axios.delete(`/contacts/${id}`);
      if (data.data.success) {
        getFetchData();
        toast.success(data.data.message);
      } 
    } catch (error) {
      log.error(error)

      toast.error(error.response.data.message || "Something Went wrong please try again")
      
    }
  };

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.put(`/contacts/${formDataEdit._id}`, formDataEdit);
      if (data.data.success) {
        getFetchData();
        toast.success(data.data.message);
        setEditSection(false);
      }

    } catch (error) {
      log.error(error)

      toast.error(error.response.data.message || "Something Went wrong please try again")
      
    }
  };

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset page number when searching
    getFetchData();
  };

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
        <input
          type="text"
          className='search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        <button className="btn btn-search" onClick={handleSearch}>Search</button>
        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleClose={() => setAddSection(false)}
            rest={formData}
          />
        )}
        {
          editSection && (
            <Formtable
              handleSubmit={handleUpdate}
              handleOnChange={handleEditOnChange}
              handleClose={() => setEditSection(false)}
              rest={formDataEdit}
            />
          )
        }
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((el) => {
                  return (
                    <tr key={el._id}>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.phone}</td>
                      <td>{el.address}</td>
                      <td>
                        <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })) : (<tr><td colSpan="5" style={{ textAlign: "center" }}>No Data</td></tr>)
              }
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
}

export default App;
