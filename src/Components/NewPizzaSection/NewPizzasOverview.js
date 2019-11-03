import React, { useEffect } from 'react'

const NewPizzaOverview = props => {

    useEffect(() => {
        console.log("I am mounted!")
    });

    return (
        <h3>Recently Added Pizzas!</h3>
    )
}

export default NewPizzaOverview;