import React, { Component }  from 'react';
import {connect} from "react-redux";
import { Glyphicon, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import FormControl from "react-bootstrap/es/FormControl";
import Col from "react-bootstrap/es/Col";
import FormGroup from "react-bootstrap/es/FormGroup";
import Form from "react-bootstrap/es/Form";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import runtimeEnv from "@mars/heroku-js-runtime-env";
//support routing by creating a new component

class Movie extends Component {

    constructor(prop)
    {
        super(prop);
        this.updateDetails = this.updateDetails.bind(this);
        this.reviewSub = this.reviewSub.bind(this);
        this.state={
            deatils:{
                review: '',
                rating: 0
            }
        };
    }
    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null)
            dispatch(fetchMovie(this.props.movieid));
    }
    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    reviewSub() {
        const env = runtimeEnv();

        var json = {
            Review: this.state.details.review,
            Rating: this.state.details.rating,
            Movie_ID: this.props.movieId
        };

        return fetch(`${env.REACT_APP_API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(json),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                window.location.reload();
            })
            .catch( (e) => console.log(e) );

    }

    render() {
        const ActorInfo = ({Actors}) => {
            return Actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.FirstActorname}</b> {actor.FirstCharacterName}
                    <p>{}</p>
                    <b>{actor.SecondActorname}</b> {actor.SecondCharacterName}
                    <p>{}</p>
                    <b>{actor.ThirdActorname}</b> {actor.ThirdCharacterName}
                </p>
            );
        };

        const ReviewInfo = ({Reviews}) => {
            return Reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.user}</b> {''}
                    <p>{}</p>
                    <b>{review.comment}</b>{''}
                    <p>{}</p>
                    <Glyphicon glyph={'star'} /> {review.rate}
                </p>
            );
        };

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { // evaluates to true if currentMovie is null
                return <div>Loading...</div>;
            }
            return (
                <Panel>
                    <Panel.Heading>Movie Detail</Panel.Heading>
                    <Panel.Body><Image className="image" src={currentMovie.ImageUrl} thumbnail /></Panel.Body>
                    <ListGroup>
                        <ListGroupItem>{currentMovie.title}</ListGroupItem>
                        <ListGroupItem><ActorInfo Actors={currentMovie.Actors} /></ListGroupItem>
                        <ListGroupItem><h4><Glyphicon glyph={'star'} /> {currentMovie.avgRating} </h4></ListGroupItem>
                    </ListGroup>
                    <Panel.Body><ReviewInfo Reviews={currentMovie.Reviews} /></Panel.Body>
                </Panel>
            );
        };


        return (
            <div>
                <DetailInfo currentMovie={this.props.selectedMovie} />
                <Form horizontal>
                    <FormGroup controlId="comment">
                        <Col componentClass={ControlLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.comment} type="text" placeholder="type review here..." />
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieid: ownProps.match.params.movieid
    }
};

export default withRouter(connect(mapStateToProps)(Movie));