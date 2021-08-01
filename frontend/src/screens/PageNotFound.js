import React from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const PageNotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <Meta title="Page not found"></Meta>
      <h1>Error 404</h1>
      <h3>UH OH! You're lost.</h3>
      <p style={{ maxWidth: "500px", fontSize: "18px", marginTop: "20px" }}>
        The page you are looking for does not exist. How you got here is a
        mystery. But you can click the button below to go back to the homepage.
      </p>
      <Link className="btn btn-success my-3" to="/campgrounds">
        Go Back
      </Link>
    </div>
  );
};

export default PageNotFound;
