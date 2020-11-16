import React from "react";

const Header = (props) => {
  return (
    <div>
      <div
        className="align-center"
        style={{
          gap: "10px",
          fontSize: "30px",
        }}
      >
        <img
          style={{ width: "60px" }}
          alt="app-logo"
          src="https://www.feirox.com/rivu/2016/04/Klara-1-1.png"
        ></img>
        <p>Current Weather</p>
      </div>
      <br></br>
      <div
        className="align-center"
        style={{
          gap: "20px",
        }}
      >
        <img
          style={{ cursor: "pointer", width: "30px" }}
          alt="location access"
          onClick={() => props.getUserLocation()}
          src="https://img.icons8.com/ios-filled/50/000000/marker.png"
        ></img>
        <input
          style={{ borderRadius: "5px", padding: "5px" }}
          placeholder="city..."
          onKeyPress={(e) =>
            e.key === "Enter" && e.target.value !== ""
              ? props.getLocation(e)
              : null
          }
        ></input>
      </div>
      <p className="not-found">
        {props.errorLoading ? "Ops, something went wrong" : null}
      </p>
    </div>
  );
};

export default Header;
