import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Table } from "react-bootstrap";
import {
  setCategories,
  setTypes,
  setCategoryName,
  setCategoryType,
  setSelectedCategory,
  setShowModal,
  setPreviewContent,
} from "../../Routes/Slices/settingsLogin";
import { useNavigate } from "react-router-dom";
import ListExample from "../Navbar/nav";
import axios from "axios";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settingstate = useSelector((state) => state.settings);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const localToken = localStorage.getItem("__token");
  const registerID = localStorage.getItem("__registerID");
  const headers = { Authorization: `Bearer ${localToken}` };

  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await axios.get(
        `http://127.0.0.1:5000/getCategory/${registerID}`,
        { headers }
      );
      console.log("catagorys",categoriesSnapshot.data)
      dispatch(setCategories(categoriesSnapshot.data));
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTypes = async (categoryId) => {
    if (!categoryId) return;
    try {
      const typesSnapshot = await axios.get(
        `http://127.0.0.1:5000/settingGetType/${categoryId}`,
        { headers }
      );
      dispatch(setTypes(typesSnapshot.data));
      console.log("typesSnapshot", typesSnapshot.data);
    } catch (error) {
      console.error("Error fetching types: ", error);
      alert("Failed to fetch types. Please try again.");
    }
  };

  const openModal = () => {
    dispatch(setShowModal(true));
  };

  const closeModal = () => {
    dispatch(setShowModal(false));
  };

  const openTypeModal = (categoryId) => {
    setCurrentCategoryId(categoryId);
    dispatch(setSelectedCategory(categoryId));
    setShowTypeModal(true);
    fetchTypes(categoryId);
    generatePreview(categoryId, settingstate.categoryType);
  };

  const closeTypeModal = () => {
    setShowTypeModal(false);
  };

  const handleCategorySubmit = async () => {
    if (!settingstate.categoryName) {
      alert("Please enter a category name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryName", settingstate.categoryName);
      formData.append("registerID", registerID);

      const categoryRef = await axios.post(
        "http://127.0.0.1:5000/categoryList",
        formData,
        { headers }
      );
      const newCategory = {
        categoryId: categoryRef.data.categoryId,
        categoryName: settingstate.categoryName,
        registerID: categoryRef.data.registerID,
      };
      console.log("Categorys", newCategory);
      dispatch(setCategories([...settingstate.categories, newCategory]));
      dispatch(setCategoryName(""));
      closeModal();
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const handleCategoryTypeChange = (e) => {
    dispatch(setCategoryType(e.target.value));
    generatePreview(currentCategoryId, e.target.value);
  };

  const handleAddCategoryType = async () => {
    if (!currentCategoryId || !settingstate.categoryType) {
      alert("Please select a category and enter a category type");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("typeName", settingstate.categoryType);
      formData.append("categoryId", currentCategoryId);
      formData.append("registerID", registerID);
  
      // Add new type
      await axios.post(
        "http://127.0.0.1:5000/typeList",
        formData,
        { headers }
      );
  
      // Get updated type list by categoryId (NOT registerID)
      const typeNewData = await axios.get(
        `http://127.0.0.1:5000/settingGetType/${currentCategoryId}`,
        { headers }
      );
  
      // Find the latest added type
      const latestType = typeNewData.data?.find(
        (type) =>
          type.typeName === settingstate.categoryType &&
          type.categoryId === currentCategoryId
      );
  
      if (!latestType) {
        alert("New type not found in response");
        return;
      }
  
      const newType = {
        typeId: latestType.typeId,
        typeName: latestType.typeName,
        categoryId: latestType.categoryId,
      };
  
      dispatch(setTypes([...settingstate.types, newType]));
      dispatch(setCategoryType(""));
      closeTypeModal();
      alert("Category Type added successfully!");
    } catch (error) {
      console.error("Error adding category type:", error);
      alert("Failed to add category type. Please try again.");
    }
  };
  

  const generatePreview = (categoryId, typeName) => {
    if (!categoryId || !typeName) return;
    const createEmail = `Please give a "${getCategoryNameById(
      categoryId
    )}" related "${typeName}" email!`;
    dispatch(setPreviewContent(createEmail));
  };

  const getCategoryNameById = (categoryId) => {
    const selectedCategory = settingstate.categories.find(
      (category) => category.categoryId === categoryId
    );
    return selectedCategory ? selectedCategory.categoryName : "";
  };

  const handleDeleteType = async (typeId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/deleteList/${typeId}`,
        { headers }
      );
      dispatch(
        setTypes(settingstate.types.filter((type) => type.typeId !== typeId))
      );
      alert("Type deleted successfully!");
    } catch (error) {
      console.error("Error deleting type: ", error);
      alert("Failed to delete type. Please try again.");
    }
  };

  const handleNavigateGeneratePage = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <header>
        <ListExample />
      </header>
      <br />
      <div className="container mt-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-8 col-12 text-center">
            <h1 className="mt-3 mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
              Manage Email Recipients
            </h1>
          </div>
          <div className="col-lg-4 col-12 text-end">
            <button className="btn btn-dark" type="button" onClick={openModal}>
              Add Recipient
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-body p-3">
              <div className="table-responsive">
                <table className="table table-striped align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-xs font-weight-bold opacity-7 text-center fs-6">ID</th>
                      <th className="text-uppercase text-xs font-weight-bold opacity-7 ps-2 text-center fs-6">Recipient Name</th>
                      <th className="text-uppercase text-xs font-weight-bold opacity-7 ps-2 text-center fs-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settingstate.categories.map((category, index) => (
                      <tr key={category.categoryId}>
                        <td className="text-sm text-center">
                          <p className="mb-0 font-weight-normal text-sm">{index + 1}</p>
                        </td>
                        <td className="text-sm text-center">
                          <p className="mb-0 font-weight-normal text-sm">{category.categoryName}</p>
                        </td>
                        <td className="text-sm text-center">
                          <button className="btn btn-secondary btn-sm" onClick={() => openTypeModal(category.categoryId)}>
                            Add Email Type
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
      </div>

      <Modal show={settingstate.showModal} onHide={closeModal}>
        <center>
          <Modal.Header closeButton>
            <Modal.Title>
              <h2>Enter Recipients Name</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={settingstate.categoryName}
              onChange={(e) => dispatch(setCategoryName(e.target.value))}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCategorySubmit}>Submit</Button>
          </Modal.Footer>
        </center>
      </Modal>

      <Modal show={showTypeModal} onHide={closeTypeModal}>
        <center>
          <Modal.Header closeButton>
            <Modal.Title>
              <h2>Enter Recipients Type</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={settingstate.categoryType}
              onChange={handleCategoryTypeChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddCategoryType}>Submit</Button>
          </Modal.Footer>
        </center>
      </Modal>

      {settingstate.previewContent && (
        <div className="preview">
          <h3>Preview:</h3>
          <p>{settingstate.previewContent}</p>
        </div>
      )}

      {settingstate.types.length > 0 && (
        <div className="table-responsive-sm">
          <div className="container-sm">
            <h2>Recipients Email Types List:</h2>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Recipients Email Types</th>
                  <th>Email Recipients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingstate.types.map((type, i) => (
                  <tr key={type.typeId}>
                    <td>{i + 1}</td>
                    <td>{type.typeName}</td>
                    <td>{getCategoryNameById(type.categoryId)}</td>
                    <td>
                      <button onClick={() => handleDeleteType(type.typeId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
