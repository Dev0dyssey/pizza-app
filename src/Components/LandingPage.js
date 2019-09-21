import React from 'react';
import { Link } from 'react-router-dom';
import '../StyleSheets/landing.css';

const Landing = () => {
    return (
        <div className="bgImg">
            <div className="jumbotron background-pizza" style={{ textAlign: "center", marginTop: "25vh", verticalAlign: "baseline"}}>
                <h1>PIZZA RATE</h1>
                <Link to = {`/login`}>
                    <btn className="btn btn-primary" style={{marginTop: "0.5rem"}}>ENTER</btn>
                </Link>
                <br/>
                <br/>
                <p>Please explore and test the App!</p>
            </div>
        </div>
    )
}

export default Landing;