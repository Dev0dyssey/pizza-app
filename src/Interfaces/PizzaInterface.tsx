import React, { useState } from "react";

export default interface PizzaInterface {
  owner: string;
  name: string;
  photo: string;
  restaurant: string;
  rating: number;
  ratings: number[];
  comment: string;
  added: Date;
}
