import { Link } from "react-router-dom";
import "../StyleSheets/landing.css";

export default function Landing() {
  return (
    <div className="bgImg">
      <div
        className="jumbotron background-pizza"
        style={{
          textAlign: "center",
          marginTop: "25vh",
          verticalAlign: "baseline",
        }}
      >
        <h1>PIZZA RATE</h1>
        <Link className="btn btn-primary mt-2" to="/login">
          Enter
        </Link>
        <br />
        <br />
        <p>Please explore and test the App!</p>
      </div>
    </div>
  );
}
