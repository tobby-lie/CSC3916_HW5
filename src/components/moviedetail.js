import React, { Component } from 'react';
import {fetchMovie, postReivew, setMovie} from "../actions/movieActions";
import {connect} from 'react-redux';
import {Card, ControlLabel, Col, Form, FormGroup, ListGroup, ListGroupItem, Button} from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image } from 'react-bootstrap';
import {submitLogin} from "../actions/authActions";
import runtimeEnv from "@mars/heroku-js-runtime-env";


class MovieDetail extends Component {

    constructor(props) {
        super(props);
        this.updateDetails = this.updateDetails.bind(this)
        this.submitReview = this.submitReview.bind(this)
        this.state = {
            review_details: {
                title: "",
                rating: 0,
                small_quote: ""
            }
        }

        this.rating = ''
        this.message = ''
    }

    // submitReview () {
    //     const env = runtimeEnv();
    //     let review_data = {
    //         'title': this.props.selectedMovie.title,
    //         'small_quote': this.state.review_details.small_quote,
    //         'rating': this.state.review_details.rating
    //     }
    //
    //     return fetch(`${env.REACT_APP_API_URL}/reviews`, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': localStorage.getItem('token')
    //         },
    //         mode: 'cors',
    //         body: JSON.stringify(review_data)
    //     }).then((response) => {
    //         if (!response.ok) {
    //             throw Error(response.statusText);
    //         }
    //         return response.json()
    //     }).then((res) => {
    //         console.log(res.json())
    //     }).catch((e) => console.log(e));
    // }

    submitReview(){
        console.log("in submit review")
        const {dispatch} = this.props;
        if (this.state.review_details.small_quote === "" || this.state.review_details.rating === 0) {
            alert("Empty rating or review");
        } else {
            this.state.review_details.title = this.props.selectedMovie.title;
            dispatch(postReivew(this.state.review_details));
            window.location.reload();
        }
    }

    updateDetails(event) {

        // console.log("in update details")
        let updateDetails = Object.assign({}, this.state.review_details)

        updateDetails[event.target.id] = event.target.value;

        this.setState({
            review_details: updateDetails
        })
        // console.log('update details', updateDetails)
    }

    render() {

        const DetailInfo = () => {
            if (!this.props.selectedMovie) {
                return <div>Loading....</div>
            }

            return (
                <Card>
                    <Card.Header>Movie Detail</Card.Header>
                    <Card.Body>
                        <Image className="image" src={this.props.selectedMovie.imageUrl} thumbnail />
                    </Card.Body>
                    <ListGroup>
                        <ListGroupItem>{this.props.selectedMovie.title}</ListGroupItem>
                        <ListGroupItem>
                            {this.props.selectedMovie.actors.map((actor, i) =>
                                <p key={i}>
                                    <b>{actor.actor_name}</b> {actor.character_name}
                                </p>)}
                        </ListGroupItem>
                        <ListGroupItem><h4><BsStarFill/> {this.props.selectedMovie.averaged_rating}</h4></ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        {this.props.selectedMovie.reviews.map((review, i) =>
                            <p key={i}>
                                <b>{review.username}</b>&nbsp; {review.small_quote}
                                &nbsp;  <BsStarFill /> {review.rating}
                            </p>
                        )}
                    </Card.Body>
                    <Form>
                        <Form.Group controlId="rating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control onChange={this.updateDetails} value={this.state.review_details.rating} type="number" min="1" max="5" />
                        </Form.Group>

                        <Form.Group controlId="small_quote">
                            <Form.Label>Review</Form.Label>
                            <Form.Control onChange={this.updateDetails} value={this.state.review_details.small_quote} type="text" placeholder="Write a new review" />
                        </Form.Group>

                        <Button onClick={this.submitReview}>Submit Review</Button>
                    </Form>
                </Card>
            )
        }

        return (
            <DetailInfo />
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie
    }
}

export default connect(mapStateToProps)(MovieDetail);

