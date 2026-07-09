import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar as RBNavbar,
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
  Button,
  Image,
} from "react-bootstrap";

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setShowOffcanvas(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingClick = (serviceName) => {
    if (onOpenBooking) {
      onOpenBooking(serviceName);
    } else {
      navigate("/", { state: { openBooking: serviceName } });
    }
    setShowOffcanvas(false);
  };

  const bookTrialItems = [
    { label: "Dance Trial", service: "Dance Classes (Free Trial)" },
    { label: "Garba Trial", service: "Garba Classes (Free Trial)" },
    { label: "Yoga Trial", service: "Yoga Classes (Free Trial)" },
  ];

  return (
    <RBNavbar
      expand="md"
      fixed="top"
      className={`transition-all duration-300 py-3 ${isScrolled || location.pathname === "/contact" ? "glass-nav py-2" : "bg-transparent"}`}
      variant="dark"
      style={{ zIndex: 1000 }}
    >
      <Container fluid className="px-4 px-md-5">
        <RBNavbar.Brand
          as={Link}
          to="/"
          onClick={handleNavClick}
          className="d-flex align-items-center gap-2"
        >
          <Image
            src="/danzup-logo.png"
            rounded
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
            alt="DANZUP STUDIO Logo"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop";
            }}
          />
          <span className="text-gold-gradient font-serif h5 mb-0 font-weight-bold tracking-wider">
            DANZUP STUDIO
          </span>
        </RBNavbar.Brand>

        <RBNavbar.Toggle
          aria-controls="offcanvasNavbar"
          className="border-0 text-white bg-transparent"
          onClick={() => setShowOffcanvas(true)}
        />

        <RBNavbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          className="bg-brand-dark text-white"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {[
                "/",
                "/about",
                "/classes",
                "/studio-look",
                "/celebrations",
                "/gallery",
                "/contact",
              ].map((path, index) => {
                const labels = [
                  "HOME",
                  "ABOUT",
                  "CLASSES",
                  "STUDIO LOOK",
                  "CELEBRATIONS",
                  "GALLERY",
                  "CONTACT",
                ];
                return (
                  <Nav.Link
                    key={path}
                    as={NavLink}
                    to={path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `nav-link-brand ${isActive ? "active" : ""}`
                    }
                  >
                    {labels[index]}
                  </Nav.Link>
                );
              })}
            </Nav>
            <div className="mt-4 d-flex flex-column gap-2">
              <span className="text-uppercase tracking-wider text-brand-gold small font-weight-bold">
                Book Free Trial
              </span>
              {bookTrialItems.map((item) => (
                <Button
                  key={item.service}
                  variant="outline-light"
                  className="text-start text-white-50 hover-text-brand-gold"
                  onClick={() => handleBookingClick(item.service)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Offcanvas.Body>
        </RBNavbar.Offcanvas>

        <div className="d-none d-md-flex align-items-center gap-4">
          <Nav className="align-items-center">
            {[
              "/",
              "/about",
              "/classes",
              "/studio-look",
              "/celebrations",
              "/gallery",
              "/contact",
            ].map((path, index) => {
              const labels = [
                "HOME",
                "ABOUT",
                "CLASSES",
                "STUDIO LOOK",
                "CELEBRATIONS",
                "GALLERY",
                "CONTACT",
              ];
              return (
                <Nav.Link
                  key={path}
                  as={NavLink}
                  to={path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `nav-link-brand ${isActive ? "active" : ""}`
                  }
                >
                  {labels[index]}
                </Nav.Link>
              );
            })}
          </Nav>

          <NavDropdown
            title={
              <span
                className="btn btn-gold rounded-0 py-2.5 px-4 btn-luxury d-flex align-items-center gap-2 text-xs font-weight-bold"
                style={{ fontSize: "12px" }}
              >
                BOOK TRIAL
              </span>
            }
            id="trialDropdown"
            align="end"
            menuVariant="dark"
            className="nav-trial-dropdown"
          >
            {bookTrialItems.map((item) => (
              <NavDropdown.Item
                key={item.service}
                onClick={() => handleBookingClick(item.service)}
                className="text-white-50"
                style={{ cursor: "pointer" }}
              >
                {item.label}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </div>
      </Container>
    </RBNavbar>
  );
}
