import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListExample from "../Navbar/nav";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
  setFbGeneratedDatas,
  setSelectTemplate,
} from "../../Routes/Slices/templateSlice";
import "./index.css";

const Template = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    fbCategory = [],
    fbType = [],
    selectedCategory = [],
    fbGeneratedDatas = [],
    selectTemplate = {},
  } = useSelector((state) => state.template);

  const [selectType, setSelectType] = useState([]);
  const [regen, setRegen] = useState(false);

  const localToken = localStorage.getItem("__token");
  const registerID = localStorage.getItem("__registerID");
  const headers = { Authorization: `Bearer ${localToken}` };

  // Fetch Categories
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/getCategory/${registerID}`, { headers });
      dispatch(setFbCategory(res.data));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch Types
  const fetchTypes = async (categoryId, categoryName) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/settingGetType/${categoryId}`, { headers });
      dispatch(setFbType(res.data));
  
      const filteredTypes = res.data.map((type) => ({
        ...type,
        categoryName: categoryName,
      }));
      dispatch(setSelectedCategory(filteredTypes));
      setSelectType([]);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };
  

  // Fetch Templates
  const fetchTemplate = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/getParticulartUsetTemplate/${registerID}`, { headers });
      dispatch(setFbGeneratedDatas(res.data));
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };
  useEffect(() => {
    fetchCategory();
    fetchTemplate();
    
  }, []);
  
  // useEffect(() => {
  //   fetchCategory();
  //   fetchTypes();
  //   fetchTemplate();
  // }, []);

  const handleCategoryClick = (id, name) => {
    fetchTypes(id); 
  
    const filteredTypes = fbType
      .filter((type) => parseInt(type.categoryId) === parseInt(id))
      .map((type) => ({
        ...type,
        categoryName: name,
      }));
    dispatch(setSelectedCategory(filteredTypes));
    setSelectType([]); 
  };
  
  const handleTypeClick = (id) => {
    const selectedTemplates = fbGeneratedDatas.filter(
      (temp) => parseInt(temp.typeId) === parseInt(id)
    );
    setSelectType(selectedTemplates);
  };
  
  // const handleTemplateSelected = (temp, datas, id) => {
  //   dispatch(setSelectTemplate({ temp, datas, id }));
  //   setRegen(true);
  // };

  
  const handleTemplateSelected = (template, data, register_id) => {
    console.log("Selected Template:", template, "Extra:", data, "register_id:", register_id);
    // Perform selection logic
  };
  
  const handleRegenerateToDashboard = () => navigate("/dashboard");

  const handleSubmit = () => {
    navigate(`/finalPage/${selectTemplate.id}/${registerID}`);
  };

  return (
    <>
      <center>
        <header>
          <ListExample />
        </header>

        <h5 className="fs-3 mt-4" style={{ color: "black" }}>
          Select Email Recipient
        </h5>

        {/* Category Cards */}
        <div className="row mt-5">
          {Array.isArray(fbCategory) && fbCategory.map((cat, i) => (
            <div key={i} className="col-xl-2 col-lg-3 col-md-4 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <p className="card-text cat">{cat.categoryName}</p>
                  <button
                    className="btn-class-name"
                    onClick={() => handleCategoryClick(cat.categoryId, cat.categoryName)}
                    style={{ width: "50%" }}
                  >
                    <span className="back"></span>
                    <span className="front">Click</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Type Cards */}
        {Array.isArray(selectedCategory) && selectedCategory.length > 0 && (
          <div className="row mt-5">
            <h5 className="fs-3 text-white">Select Email Type</h5>
            {selectedCategory.map((typ, i) => (
              <div key={i} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <p className="card-text cat">{typ.typeName}</p>
                    <button
                      className="btn bg-gradient-success"
                      onClick={() => handleTypeClick(typ.typeId)}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Carousel */}
        {Array.isArray(selectType) && selectType.length > 0 && (
          <div className="row mt-5 justify-content-center">
            <h5 className="fs-3" style={{ color: "black" }}>
              Select Template
            </h5>
            <div className="col-md-6">
              <div id="templateCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  {selectType.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#templateCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {selectType.map((temp, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <div className="card">
                        <div className="card-body text-start">
                          <p className="card-text">{temp.templates}</p>
                          <center>
                            <button
                              className="btn bg-gradient-primary"
                              onClick={() =>
                                handleTemplateSelected(
                                  temp.templates,
                                  temp.datas,
                                  temp.generatedDataId
                                )
                              }
                            >
                              Choose
                            </button>
                          </center>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#templateCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#templateCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Preview */}
        <Modal
          show={regen}
          onHide={() => setRegen(false)}
          size="lg"
          centered
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Email Preview! You can edit your email!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              value={selectTemplate.temp || ""}
              readOnly
              style={{
                width: "100%",
                height: "60vh",
                padding: "10px",
                fontSize: "16px",
                backgroundColor: "#f9f9f9",
                resize: "none",
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSubmit}>
              Choose Template
            </Button>
            <Button variant="info" onClick={handleRegenerateToDashboard}>
              Re-Generate
            </Button>
            <Button variant="danger" onClick={() => setRegen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </center>
    </>
  );
};

export default Template;
