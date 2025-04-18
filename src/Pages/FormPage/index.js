import React, { useEffect, useState } from "react";
import { setDatas, setSelectTemplate } from "../../Routes/Slices/templateSlice";
import { useDispatch, useSelector } from "react-redux";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import emailjs from "@emailjs/browser";
import ListExample from "../Navbar/nav";

const FinalPage = () => {
  const dispatch = useDispatch();
  const { id, currentLoginUserId } = useParams();
  const { selectTemplate, datas } = useSelector((state) => state.template);
  const [formData, setFormData] = useState([]);
  const [show, setShow] = useState(false);
  const [template, setTemplate] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const navigate = useNavigate();

  const localToken = localStorage.getItem("__token");
  const headers = { Authorization: `Bearer ${localToken}` };

  const getData = async (DataId, registerId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/getSelectedTemplate/${DataId}/${registerId}`,
        { headers }
      );
      console.log("Template string from response:", res.data.template);
      const parsedData = JSON.parse(res.data.datas);
      dispatch(setDatas(parsedData));
      dispatch(setSelectTemplate(res.data.templates));
      console.log("Template string from response:", res.data.templates);

    } catch (error) {
      console.error("Error fetching template:", error);
    }
  };



  const handleValueChange = (index, event) => {
    const newFormData = [...formData];
    newFormData[index] = event.target.value;
    setFormData(newFormData);
    // console.log(newFormData)
  };
  

  const handleClose = () => {
    setShow(false);
  };
  // const handleFormSave = async () => {
  //   if (!Array.isArray(datas)) {
  //     alert("Template data is not loaded properly.");
  //     return;
  //   }
  
  //   setShow(true);
  //   let newTemplates = selectTemplate;
  
  //   datas.forEach((pair, index) => {
  //     const key = pair.key;
  //     const value = formData[index] || "";
  //     newTemplates = newTemplates.replace(
  //       new RegExp(`\\[Enter ${key}\\]`, "g"),
  //       value
  //     );
  //   });
  
  //   setTemplate(newTemplates);
  // };
  
  const handleFormSave = async () => {
    if (!Array.isArray(datas)) {
      alert("Template data is not loaded properly.");
      return;
    }
  
    if (!selectTemplate) {
      alert("No template content found to populate.");
      return;
    }
  
    let newTemplates = selectTemplate;
  
    datas.forEach((pair, index) => {
      const key = pair.key;
      const value = formData[index] || "";
      newTemplates = newTemplates.replace(
        new RegExp(`\\[Enter ${key}\\]`, "g"),
        value
      );
      console.log("newtemplate",newTemplates)
    });
  
    setTemplate(newTemplates);
    setShow(true);
  };
  


  useEffect(() => {
    console.log("Params:", id, currentLoginUserId); 
    if (id && currentLoginUserId) {
      getData(id, currentLoginUserId);
    } else {
      console.warn("Missing parameters in URL.");
    }
  }, []);
  
  
  const sendEmil = (content) => {
    const data = {
      to_email: toEmail,
      message: content,
      subject: mailSubject,
    };
  
    emailjs
      .send("service_lz71gf3", "template_nu02of7", data, "GEPKT28Xn5AU0p2vl")
      .then(
        (result) => {
          console.log("SUCCESS!", result.text);
          alert("Email send successful ✔️");
          navigate("/template");
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Email send failed ❌");
        }
      );
  };
  

  return (
    <>
      <header>
        <ListExample />
      </header>
      <br />
      <center>
        <h2 className="mt-5">Add Your Details Here!</h2>
      </center>
      <div
        style={{
          width: "600px",
          margin: "100px auto",
        }}
      >
        <div className="row">
          {Array.isArray(datas) &&
            datas.map((doc, index) => (
              <FloatingLabel
                controlId={`floatingInput${index}`}
                key={index}
                label={doc.key}
                className="mb-3"
                style={{ textTransform: "capitalize", margin: "34px 0" }}
                required
              >
                <Form.Control
                  required
                  placeholder={doc.key}
                  onChange={(event) => handleValueChange(index, event)}
                  style={{ textTransform: "capitalize" }}
                />
              </FloatingLabel>
            ))}
        </div>
        <Button type="button" variant="primary" onClick={handleFormSave}>
          Proceed
        </Button>
      </div>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Preview Your Email!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel key={1} label="Enter email" className="mb-3">
            <Form.Control
              placeholder="Enter email"
              className="col-xl-4"
              name="to_email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel key={1} label="Enter email subject" className="mb-3">
            <Form.Control
              placeholder="Enter email subject"
              name="subject"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
            />
          </FloatingLabel>
          <textarea
            value={template}
            style={{
              width: "100%",
              height: "60vh",
              border: "none",
              padding: "10px",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              resize: "none",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              boxSizing: "border-box",
            }}
            onChange={(e) => setTemplate(e.target.value)}
            name="message"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => sendEmil()}>
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FinalPage;
