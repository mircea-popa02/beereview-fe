import { useEffect, useState } from 'react';
import { Badge, Button, Form, Modal, Container } from 'react-bootstrap';
import Rating from 'react-rating';

const addFontAwesome = () => {
    const link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);
};

function Review({ beerId }) {
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(0);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        addFontAwesome();
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleBadgeClick = (profile) => {
        setSelectedProfiles((prevSelectedProfiles) =>
            prevSelectedProfiles.includes(profile)
                ? prevSelectedProfiles.filter((p) => p !== profile)
                : [...prevSelectedProfiles, profile]
        );
    };

    const handleSave = async () => {
        const reviewData = {
            beer_id: beerId,
            rating: rating,
            tastes: selectedProfiles,
            review: message,
        };

        try {
            const response = await fetch('http://localhost:5000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                console.log('Review submitted successfully');
            } else {
                console.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        handleClose();
    };

    const tasteProfiles = ['Sweet', 'Sour', 'Bitter', 'Malt', 'Smoke', 'Tart & Funky'];

    return (
        <>
            <Button variant="info" onClick={handleShow}>
                Add Review
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Write your review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ratingInput">
                            <Form.Label>Rating</Form.Label>
                            <div>
                                <Rating
                                    emptySymbol={<i className="fa fa-star-o fa-2x" style={{ color: '#ddd' }}></i>}
                                    fullSymbol={<i className="fa fa-star fa-2x" style={{ color: '#ffd700' }}></i>}
                                    initialRating={rating}
                                    onChange={handleRatingChange}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="tasteProfileInput">
                            <Form.Label>Taste profile</Form.Label>
                            <div>
                                {tasteProfiles.reduce((acc, profile, idx) => {
                                    if (idx % 3 === 0) acc.push([]);
                                    acc[acc.length - 1].push(profile);
                                    return acc;
                                }, []).map((row, rowIndex) => (
                                    <Container className='d-flex justify-content-start'>
                                        {row.map((profile) => (
                                            <Badge
                                                pill
                                                bg={
                                                    profile === 'Sweet' ? 'primary' :
                                                    profile === 'Sour' ? 'dark' :
                                                    profile === 'Bitter' ? 'warning' :
                                                    profile === 'Malt' ? 'danger' :
                                                    profile === 'Smoke' ? 'info' :
                                                    'success'
                                                }
                                                className={`taste-badge ${selectedProfiles.includes(profile) ? 'selected' : ''}`}
                                                onClick={() => handleBadgeClick(profile)}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    padding: '10px 15px',
                                                    marginTop: '15px'
                                                }}
                                            >
                                                {profile}
                                            </Badge>
                                        ))}
                                        </Container>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="messageInput">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                placeholder='Share your thoughts'
                                as="textarea" rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Review;
