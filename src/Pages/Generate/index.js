import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  setCategoryList,
  setTypesList,
  setSelectedCategory,
  setIsPopUp,
  setIsCategorySelected,
  setSelectedType,
  setIsTypeSelected,
  setAnswer,
  setSelectedCategoryName,
  setSelectedTypeName,
  setShow,
  setIsApiResponseReceived,
} from "../../Routes/Slices/dashBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Navbar/index.css";
import "./index.css";
import axios from "axios";
import ListExample from "../Navbar/nav";
import emailjs from "@emailjs/browser";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function Dashboard() {
  const localToken = localStorage.getItem("__token");
  let registerID = localStorage.getItem("__registerID");

  const adminSlice = useSelector((state) => state.adminLogin);
  const slice = useSelector((state) => state.dashboardslice);
  const templateSlice = useSelector((state) => state.template);
  const dispatch = useDispatch();

  const headers = { Authorization: `Bearer ${localToken}` };

  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [pairs, setPairs] = useState([{ key: "", value: "" }]);
  const [updatedContent, setUpdatedContent] = useState("");

  //Key Value Pairs************************
  let keyValuePair = [];
  for (let each of pairs) {
    keyValuePair.push(each.key + ":" + each.value);
  }

  let stringedPairs = JSON.stringify(keyValuePair);

  const handleKeyChange = (i, event) => {
    const newPair = [...pairs];
    newPair[i].key =
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setPairs(newPair);
  };

  const handleRemoveInputBox = (i) => {
    const newArray = [...pairs];
    newArray.splice(i, 1);
    setPairs(newArray);
  };

  const handleValueChange = (i, event) => {
    const newPair = [...pairs];
    newPair[i].value =
      event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setPairs(newPair);
  };

  const handleAddPair = () => {
    setPairs([...pairs, { key: "", value: "" }]);
  };
  console.log("pairs", pairs);

  const handleGenerate = (event) => {
    event.preventDefault();
    dispatch(setIsPopUp(true));
  };

  const formData = new FormData();
  const handleSave = async () => {
    {
      slice.isApiResponseReceived &&
      formData.append("categoryId", slice.selectedCategory);
      formData.append("typeId", slice.selectedType);
      formData.append("datas", JSON.stringify(pairs));
      formData.append("templates", updatedContent);
      formData.append("registerID", registerID);

      await axios
        .post("http://127.0.0.1:5000/dataBasePostGeneratedDatas", formData, {
          headers,
        })
        .then((res) => {
          console.log("res", res);
        });
    }
  };

  const handleClose = () => {
    dispatch(setIsPopUp(false));
    dispatch(setIsApiResponseReceived(false));
    dispatch(setIsTypeSelected(false));
    dispatch(setIsCategorySelected(false));
  };

  const getCategory = async () => {
    await axios
      .get(`http://127.0.0.1:5000/getCategory/${registerID}`, { headers })
      .then((res) => {
        console.log("res", res.data);
        dispatch(setCategoryList(res.data));
      });
  };
  console.log("dbCategoryList", slice.categoryList);

  useEffect(() => {
    getCategory();
  }, []);

  const getTypes = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/settingGetType/${slice.selectedCategory}`,
        { headers }
      );
      dispatch(setTypesList(res.data));
    } catch (error) {
      console.error("Error fetching types:", error);
      alert("Failed to fetch types.");
    }
  };

  useEffect(() => {
    if (slice.isCategorySelected && slice.selectedCategory) {
      getTypes();
    }
  }, [slice.selectedCategory, slice.isCategorySelected]);

  useEffect(() => {
    const selected = slice.categoryList.find(
      (cat) => cat.categoryId === slice.selectedCategory
    );
    if (selected) {
      dispatch(setSelectedCategoryName(selected.categoryName));
    }
  }, [slice.selectedCategory, slice.categoryList]);

  useEffect(() => {
    for (let each of slice.typesList) {
      if (each.typeId == slice.selectedType) {
        dispatch(setSelectedTypeName(each.typeName));
      }
    }
  }, [slice.selectedType]);

  async function generateAnswer() {
    dispatch(setAnswer("Loading..."));
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCz99WSRmT6l2fQVEHFMXf1hZqXre7GQgQ",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Please give a "${slice.selectedTypeName}" to "${slice.selectedCategoryName}" with these given datas only "${stringedPairs}" in a email format without subject and don't give empty placeholders`,
                },
              ],
            },
          ],
        },
      });

      const candidate = response?.data?.candidates?.[0];
      const geminiText = candidate?.content?.parts?.[0]?.text;

      if (!geminiText) {
        dispatch(setAnswer("No content generated. Please try again."));
        dispatch(setIsApiResponseReceived(false));
        return;
      }

      dispatch(setAnswer(geminiText));
      dispatch(setIsApiResponseReceived(true));

      const valueArray = pairs.map((pair) => pair.value);
      const keyArray = pairs.map((pair) => pair.key);

      let newParagraph = geminiText;

      valueArray.forEach((value, index) => {
        if (newParagraph.includes(value)) {
          newParagraph = newParagraph.replace(
            new RegExp(value, "g"),
            `[Enter ${keyArray[index]}]`
          );
        }
      });

      setUpdatedContent(newParagraph);
      console.log("Final content:", newParagraph);
    } catch (error) {
      console.error("Gemini API error:", error);
      dispatch(
        setAnswer("API call failed. Please check your network or try again.")
      );
      dispatch(setIsApiResponseReceived(false));
    }
  }

  const handleContentEdit = (e) => {
    dispatch(setAnswer(e.target.value));
  };

  const handleSendEmail = (e) => {
    const data = {
      to_email: toEmail,
      body: slice.answer,
      subject: subject,
    };

    emailjs
      .send("service_tpjzc04", "template_4ri6k1g", data, "pVORWS1vmcvLsdZvs")
      .then(
        (result) => {
          console.log("SUCCESS!", result.text);
          console.log("Sending email with content:", slice.answer);
          alert("Email send successfull✔️");
        },
        (error) => {
          console.log("FAILED...", error.text);
          console.log("error", error);
          alert("Email send failed❌");
        }
      );
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        integrity="sha384-DyZ88mC6Up2uqS1DVho8X8v50C6H3l8Nj+lsIX4rtZ3q/k1bsRjhR2KxAxhgjjvL"
        crossorigin="anonymous"
      />
      <div className="generatePageContainer">
        <center>
          <header>
            <ListExample />
          </header>
          <br /> <br />
          <div>
            <br />

            <div className="container">
              <div className="row justify-content-center border-dark rounded p-3">
                <div
                  className="col-md-6 align-self-center text-center"
                  style={{ position: "relative" }}
                >
                  <select
                    className="form-control"
                    name="choices-language"
                    id="choices"
                    onChange={(e) => {
                      dispatch(setSelectedCategory(e.target.value));
                      dispatch(setIsCategorySelected(true));
                    }}
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      paddingRight: "2rem",
                      background: "gainsboro",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                      width: "100%",
                    }}
                  >
                    <option selected disabled>
                      Select a Category
                    </option>
                    {slice.categoryList.map((categories, i) => (
                      <option key={i} value={categories.categoryId}>
                        {categories.categoryName}
                      </option>
                    ))}
                  </select>
                  <i
                    className="fa fa-chevron-down"
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#333",
                    }}
                  />
                </div>
              </div>
            </div>
            <br />

            {slice.isCategorySelected && (
              <div className="container">
                <div className="row justify-content-center">
                  <div
                    className="col-md-6 align-self-center text-center"
                    style={{ position: "relative" }}
                  >
                    <select
                      className="form-control"
                      name="choices-language"
                      id="choices"
                      onChange={(e) => {
                        dispatch(setSelectedType(e.target.value));
                        dispatch(setIsTypeSelected(true));
                      }}
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        paddingRight: "2rem",
                        background: "gainsboro",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                        width: "100%",
                      }}
                    >
                      <option selected disabled>
                        Select Email Type
                      </option>
                      {slice.typesList.map(
                        (types) =>
                          slice.selectedCategory == types.categoryId && (
                            <option key={types.typeId} value={types.typeId}>
                              {types.typeName}
                            </option>
                          )
                      )}
                    </select>
                    <i
                      className="fa fa-chevron-down"
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#333",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <br />
          </div>
          {slice.isTypeSelected && (
            <>
              <h2 style={{ color: "black", fontFamily: "Arial, sans-serif" }}>
                Add Your Email Datas
              </h2>
              <div className="container mt-4">
                <form onSubmit={handleGenerate}>
                  <div className="scrollable-box">
                    {pairs.map((pair, i) => (
                      <div key={i} className="mb-3">
                        <div className="row g-3 align-items-center justify-content-center">
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Name"
                              value={pair.key}
                              onChange={(event) => handleKeyChange(i, event)}
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Varshini"
                              value={pair.value}
                              onChange={(event) => handleValueChange(i, event)}
                            />
                          </div>
                          <div className="col-md-1 text-center">
                            <button
                              type="button"
                              className="btn btn-danger mt-3"
                              onClick={() => handleRemoveInputBox(i)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3 text-center mt-4">
                    <button
                      type="button"
                      className="col-md-2 btn btn-primary"
                      onClick={handleAddPair}
                    >
                      Add Data
                    </button>
                    <button
                      type="submit"
                      className="col-md-2 btn btn-success ms-2"
                      onClick={generateAnswer}
                    >
                      Generate
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
          <Modal
            show={slice.isPopUp}
            onHide={handleClose}
            size="lg"
            centered
            style={{ backgroundColor: "white" }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-center w-100">
                {slice.selectedTypeName} to {slice.selectedCategoryName}
              </Modal.Title>
            </Modal.Header>
            {slice.isApiResponseReceived ? (
              <Modal.Body>
                <div>
                  <style>
                    {`
                    .form-control {
                      border: 1px solid black;
                      transition: border 0.3s, outline 0.3s;
                    }
                    .form-control:hover {
                      border: 1px solid #007bff;
                      outline: 2px solid #007bff;
                      outline-offset: 2px;
                    }
                  `}
                  </style>
                  <FloatingLabel
                    label="Enter Recipient's Email"
                    className="mb-3"
                  >
                    <Form.Control
                      placeholder="Enter Recipient's Email"
                      name="to_email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      className="form-control"
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Enter Subject" className="mb-3">
                    <Form.Control
                      placeholder="Enter Subject"
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="form-control"
                    />
                  </FloatingLabel>
                </div>
                <textarea
                  value={slice.answer}
                  onChange={handleContentEdit}
                  className="form-control"
                  style={{
                    height: "60vh",
                    padding: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "16px",
                    backgroundColor: "#f9f9f9",
                    resize: "none",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    boxSizing: "border-box",
                  }}
                />
              </Modal.Body>
            ) : (
              <center>
                <div class="three-body">
                  <div class="three-body__dot"></div>
                  <div class="three-body__dot"></div>
                  <div class="three-body__dot"></div>
                </div>
              </center>
            )}
            <Modal.Footer className="justify-content-center">
              <Button variant="secondary" onClick={handleClose}>
                Regenerate
              </Button>
              {slice.isApiResponseReceived ? (
                <>
                  <Button className="btn btn-success" onClick={handleSave}>
                    Save Template
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSendEmail}
                  >
                    Send E-Mail
                  </Button>
                </>
              ) : null}
            </Modal.Footer>
          </Modal>
        </center>
      </div>
    </>
  );
}
export default Dashboard;
