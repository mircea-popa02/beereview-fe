import React, { useState } from "react";
import CustomNavbar from "./Navbar";
import { Container, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Card } from "react-bootstrap";


const Search = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const [allBeers, setAllBeers] = useState([]);

  useEffect(() => {
    // fetch all beers
    fetchAllBeers().then((data) => setAllBeers(data));
    // fetch categories
    fetchBeerCategories().then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (search) {
      // filter all beers based on search term
      const results = allBeers.filter((beer) => beer.name.toLowerCase().includes(search.toLowerCase()));
      setSearchResults(results);
    }
  }, [search]);

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
        .catch((error) => console.error("Error fetching search results:", error));
    }
  }, [category]);


  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
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


  return (
    <>
      <CustomNavbar />
      <Container>
        <h1>Search</h1>
        <Form>
          <Form.Group className="mb-3 search-bar" controlId="exampleForm.ControlInput1">
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
          <div className="search-results">
            {searchResults &&
              searchResults.slice(0, 15).map((beer) => {
                return (
                  <Card style={{ width: "18rem" }}>
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
                          alert(
                            `Brewery Name: ${beer.brewery.name} \nCity: ${beer.brewery.city} \nState: ${beer.brewery.state} \nCountry: ${beer.brewery.country} \nCategory: ${beer.cat_name} \nStyle: ${beer.style_name} \nABV: ${beer.abv} \nIBU: ${beer.ibu}`
                          );
                        }}
                      >
                        Details
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
          </div>
        )}
      </Container>
    </>
  );
};

export default Search;
