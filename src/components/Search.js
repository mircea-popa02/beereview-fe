import React, { useState, useEffect } from "react";
import CustomNavbar from "./Navbar";
import { Container, Form, Button, Spinner, Card } from "react-bootstrap";
import BeerModal from "./BeerModal";
import "../styles/Search.css";

const Search = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [allBeers, setAllBeers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageButtonLimit = 5; // Number of page buttons to show at once

  const handleClose = () => setShow(false);
  const handleShow = (brewery) => {
    setSelectedItem(brewery);
    setShow(true);
  };

  useEffect(() => {
    fetchAllBeers().then((data) => setAllBeers(data));
    fetchBeerCategories().then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (search) {
      const results = allBeers.filter((beer) =>
        beer.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [search, allBeers]);

  useEffect(() => {
    if (category) {
      setLoading(true);
      fetch(`http://localhost:5000/beers?cat_name=${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data);
          setLoading(false);
        })
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    }
  }, [category]);

  const handleInputChange = (event) => {
    setCurrentPage(1);
    setSearch(event.target.value);
    setCategory("");
  };

  const handleCategoryChange = (event) => {
    setCurrentPage(1);
    setCategory(event.target.value);
    setSearch("");
  };

  const fetchBeerCategories = async () => {
    const response = await fetch(`http://localhost:5000/beers/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  };

  const fetchAllBeers = async () => {
    const response = await fetch(`http://localhost:5000/beers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const startPage = Math.max(1, currentPage - Math.floor(pageButtonLimit / 2));
    const endPage = Math.min(totalPages, startPage + pageButtonLimit - 1);

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant="dark"
          size="sm"
          onClick={() => handlePageChange(i)}
          className="page-button"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="pagination">
        <Button
          variant="dark"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {pageButtons}
        <Button
          variant="dark"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <>
      <CustomNavbar />
      <Container className="search-container">
        <h1>Search</h1>
        <p>
          Page <strong>{currentPage} of {Math.ceil(searchResults.length / itemsPerPage)}</strong>
        </p>
        <Form>
          <Form.Group
            className="mb-3 search-bar"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Control
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 search-bar" controlId="categorySelect">
            <Form.Control
              as="select"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((categoryObj, index) => {
                const categoryKey = Object.keys(categoryObj)[0];
                return (
                  <option key={index} value={categoryKey}>
                    {categoryKey}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Form>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <div className="search-results">
              {displayedResults &&
                displayedResults.map((beer) => (
                  <Card key={beer.id} style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>{beer.name}</Card.Title>
                      <Card.Text>{beer.cat_name}</Card.Text>
                      <Card.Text>{beer.style_name}</Card.Text>
                      <Card.Text>
                        {beer.abv ? parseFloat(beer.abv).toFixed(2) : "N/A"}%
                        alcohol
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleShow(beer);
                        }}
                      >
                        Details
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
            </div>
            {renderPaginationButtons()}
          </>
        )}
      </Container>
      {selectedItem && (
        <BeerModal show={show} handleClose={handleClose} beer={selectedItem} />
      )}
    </>
  );
};

export default Search;
