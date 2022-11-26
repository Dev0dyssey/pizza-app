import React, { useState } from "react";

const ProfileSettings = (props) => {
  const [pickedArray, setPickedArray] = useState<{name: string}[]| null>(null)

  const test = () => {
    setPickedArray([{name: "Pizza"}])
  }

  return (
    <>
      <h1>PROFILE SETTINGS PAGE</h1>
    </>
  );
};

export default ProfileSettings;
