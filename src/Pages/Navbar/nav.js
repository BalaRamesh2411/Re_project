import "./index.css";
import Nav from "react-bootstrap/Nav";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setIsCategorySelected,
  setIsTypeSelected,
} from "../../Routes/Slices/dashBoardSlice";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";

function ListExample() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(setIsCategorySelected(false));
    dispatch(setIsTypeSelected(false));
    navigate("/");
  };
  return (
    <>
      <Navbar expand="lg" className="navContainer bg-primary" fixed="top">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src="ai-writing-logo.png"
              alt="Brand Logo"
              className="d-inline-block align-top"
              style={{ width: "200px", height: "auto" }} // Adjust the width and height as needed
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="navbar-toggler-icon"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink
                to="/dashboard"
                className="nav-link linkInNav custom-nav-link"
              >
                <i className="fas fa-home me-1"></i> Home
              </NavLink>
              <NavLink
                to="/user/setting"
                className="nav-link linkInNav custom-nav-link"
              >
                <i className="fas fa-cog me-1"></i> Settings
              </NavLink>
              <NavLink
                to="/template"
                className="nav-link linkInNav custom-nav-link"
              >
                <i className="fas fa-file-alt me-1"></i> Templates
              </NavLink>
              <NavLink
                to="/"
                className="nav-link linkInNav custom-nav-link"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-1"></i> Logout
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default ListExample;
