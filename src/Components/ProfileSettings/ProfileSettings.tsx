import React, { useState } from "react";
import PizzaInterface from "../../Interfaces/PizzaInterface";
import { NavigationButton } from '../../UIComponents/Buttons.js';

const ProfileSettings = (props) => {
  const [pickedArray, setPickedArray] = useState<PizzaInterface[]>([]);

  const test = () => {
    setPickedArray((pickedArray) => [
      ...pickedArray,
      {
        owner: "John Doe",
        name: "Test Pizza",
        photo: "Photo URL",
        restaurant: "Pizza Restaurant Photo",
        rating: 5,
        ratings: [5, 3, 2],
        comment: "Test comment",
        added: new Date(Date.now()),
      },
    ]);

    console.log("Test was run: ", pickedArray);
  };

  return (
    <>
      <h1>PROFILE SETTINGS PAGE</h1>
      <NavigationButton label="Show all pizzas" className={'btn-primary'} onClick={test} />
      <NavigationButton label="Show all other meals" className={'btn-primary'} onClick={test} />
      <NavigationButton label="Show all" className={'btn-primary'} onClick={test} />
    </>
  );
};

export default ProfileSettings;
