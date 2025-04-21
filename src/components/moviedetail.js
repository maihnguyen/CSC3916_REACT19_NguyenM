import React, { useEffect, useState } from 'react';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error   = useSelector(state => state.movie.error);

  // Form state
  const [rating, setRating]     = useState(5);
  const [reviewText, setReview] = useState('');

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(submitReview(movieId, { review: reviewText, rating: Number(rating) }));
    setRating(5);
    setReview('');
  };

  if (loading) return <div>Loading…</div>;
  if (error)   return <div>Error: {error}</div>;
  if (!selectedMovie) return <div>No movie data.</div>;

  return (
    <Card className="bg-dark text-white p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>
      <Card.Body>
        <Image src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
        <ListGroupItem>
          {selectedMovie.actors.map((a,i)=>(
            <p key={i}><b>{a.actorName}</b> as {a.characterName}</p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4><BsStarFill /> {selectedMovie.avgRating?.toFixed(1) ?? 'N/A'}</h4>
        </ListGroupItem>
      </ListGroup>

      {/* Review Form */}
      <Card.Body className="bg-light text-dark">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reviewRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              as="select"
              value={rating}
              onChange={e => setRating(e.target.value)}
            >
              {[5,4,3,2,1,0].map(n => (
                <option key={n} value={n}>
                  {n} <BsStarFill />
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="reviewText">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={e => setReview(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            Submit Review
          </Button>
        </Form>
      </Card.Body>

      {/* Existing Reviews */}
      <Card.Body className="bg-white text-dark">
        {selectedMovie.reviews.map((r,i) => (
          <div key={i} className="mb-3">
            <b>{r.username}</b> &nbsp;<BsStarFill /> {r.rating}
            <p>{r.review}</p>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;
