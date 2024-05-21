import { useEffect } from "react";
import CustomNavbar from "./Navbar";
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Discover = () => {
  const [breweries, setBreweries] = useState([]);
  const [beers, setBeers] = useState([]);

  useEffect(() => {
    const fetchBreweries = fetch("http://localhost:5000/breweries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    const fetchBeers = fetch("http://localhost:5000/beers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    Promise.all([fetchBreweries, fetchBeers])
      .then(([breweriesData, beersData]) => {
        setBreweries(breweriesData);
        setBeers(beersData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  return (
    <>
      <CustomNavbar />
      <Container>
        <Row>
          <Col>
            <h1>Breweries</h1>
            {breweries &&
              breweries.slice(0, 15).map((brewery) => {
                return (
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>{brewery.name}</Card.Title>
                      <Card.Text>{brewery.city}</Card.Text>
                      <Card.Text>{brewery.state}</Card.Text>
                      <Card.Text>{brewery.country}</Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => {
                          alert(
                            `Brewery Name: ${brewery.name} \nCity: ${brewery.city} \nState: ${brewery.state} \nCountry: ${brewery.country}`
                          );
                        }}
                      >
                        Details
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
          </Col>
          <Col>
            <h1>Beers</h1>
            {beers &&
              beers.slice(0, 15).map((beer) => {
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Discover;
