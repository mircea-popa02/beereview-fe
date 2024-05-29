import React from "react";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../styles/Reviews.css";
import Rating from "react-rating";
import { Card } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import { Button } from "react-bootstrap";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/reviews`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        console.log("Review deleted successfully");
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } else {
        console.error("Error deleting review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <>
      <Container style={{ padding: 0, marginBottom: "2rem" }}>
        <h1>Reviews</h1>
        <p>Here are your latest reviews</p>
        <div className="review-list">
          {reviews.map((review) => (
            <Card className="review-container">
              <div key={review.id} className="review-item">
                <h3>{review.review}</h3>
                <p>{review.content}</p>
                <Rating
                  emptySymbol={
                    <i
                      className="fa fa-star-o fa-2x"
                      style={{ color: "#ddd" }}
                    ></i>
                  }
                  fullSymbol={
                    <i
                      className="fa fa-star fa-2x"
                      style={{ color: "#ffd700" }}
                    ></i>
                  }
                  initialRating={review.rating}
                  readonly
                />
                <div className="taste-profiles">
                  {review.tastes.map((taste) => (
                    <Badge
                      key={taste}
                      className="taste"
                      pill
                      bg="info"
                      style={{ marginRight: "0.5rem" }}
                    >
                      {taste}
                    </Badge>
                  ))}
                </div>
                <hr style={{ margin: "1rem 0" }} />
                <Button
                  variant="danger"
                  onClick={() => handleDelete(review._id)}
                  size="sm"
                >
                  Delete
                </Button>
              </div>
              <div className="product-info">
                <h3>{review.beer.name}</h3>
                <p>
                  <strong>Style: </strong>
                  {review.beer.style_name}
                </p>
                <p>
                  <strong>Category: </strong>
                  {review.beer.cat_name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
};

export default Reviews;
