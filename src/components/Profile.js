import React, {useState, useEffect} from 'react';
import { Card, Container, Button, Spinner } from 'react-bootstrap';
import CustomNavbar from './Navbar';
import BeerModal from './BeerModal';

const Profile = () => {
    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const pageButtonLimit = 5; // Number of page buttons to show at once

    const fetchAllFavourites = async () => {
        const response = await fetch(`http://localhost:5000/favourites`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await response.json();
    };

    useEffect(() => {
        setLoading(true);
        fetchAllFavourites()
            .then((favoriteBeers) => {
                setSearchResults(favoriteBeers)
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching favorites:', error);
            });
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = (beer) => {
        setSelectedItem(beer);
        setShow(true);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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

    const removeFavorite = (beerId) => {
        // TODO: API call to remove beer from favorites and delete the beer card
    };

    return (
        <>
            <CustomNavbar />
                <Container
                    style={{width: "70vw", height:"100vh", backgroundColor: "white"}}>
                    {loading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    ) : (
                    <>
                    <h1>Favorite Beers</h1>
                    <div className="search-results">
                        {searchResults &&
                            searchResults.map((beer) => (
                                <Card key={beer.id} style={{width: "18rem"}}>
                                    <Card.Body className="card-body">
                                        <Card.Title>{beer.name}</Card.Title>
                                        <Card.Text>{beer.cat_name}</Card.Text>
                                        <Card.Text>{beer.style_name}</Card.Text>
                                        <Card.Text>
                                            {beer.abv ? parseFloat(beer.abv).toFixed(1) : "N/A"}%
                                            alcohol
                                        </Card.Text>
                                        <Container className="d-flex justify-content-between">
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    handleShow(beer);
                                                }}
                                            >
                                                Details
                                            </Button>
                                            <i
                                                className={'fa fa-star'}
                                                onClick={() => removeFavorite(beer.id)}
                                                style={{
                                                    marginTop: '0.5rem',
                                                    fontSize: '1.5rem',
                                                    cursor: 'pointer',
                                                    color: 'gold'
                                                }}
                                            />
                                        </Container>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                    {renderPaginationButtons()}
                    {selectedItem && (
                    <BeerModal show={show} handleClose={handleClose} beer={selectedItem}/>
                    )}
                <h1>Recommended beers</h1>
                <p>TODO</p>
                </>
            )}
            </Container>
        </>
    );
};

export default Profile;