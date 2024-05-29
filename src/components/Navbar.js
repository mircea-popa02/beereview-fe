import React from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";

const CustomNavbar = () => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/home">Beereview</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="/discover">Discover</Nav.Link>
                    <Nav.Link href="/search">Search</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/login">
                        <Button
                            variant="danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
