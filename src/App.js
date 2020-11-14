import { useEffect, useState } from "react";
import "./App.css";
import React from "react";

function App() {
  const [location, setLocation] = useState({});
  const [degreeFormat, setDegreeFormat] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceLocation, setDeviceLocation] = useState([]);

  const api = (v) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${v}&appid=3069ae2718e40f8dc1998b7250e16f10`;
  const myInit = { mode: "cors" };
  const myRequest = (v) => new Request(api(v), myInit);

  const getDegreeFormat = () => (degreeFormat ? "°F" : "°C");

  const convertToCelcius = (v) => (v - 30) / 2;

  function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const ps = [
        Math.round(position.coords.latitude),
        Math.round(position.coords.longitude),
      ];
      setDeviceLocation(ps);
    });
  }

  useEffect(() => {
    if (deviceLocation.length !== 0) {
      fetchResults();
    }
  }, [deviceLocation]);

  function fetchResults() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${deviceLocation[0]}&lon=${deviceLocation[1]}&appid=3069ae2718e40f8dc1998b7250e16f10`,
      myInit
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("bad network request");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        document.querySelector(".not-found").innerHTML = "";
        setIsLoading(false);
        return setLocation(data);
      })
      .catch((e) => {
        document.querySelector(".not-found").innerHTML =
          "Ops, something went wrong";
        console.log(e);
      });
    console.log(location);
  }

  function getLocation(e) {
    fetch(myRequest(e.target.value))
      .then((response) => {
        if (!response.ok) {
          throw new Error("bad network request");
        }
        return response.json();
      })
      .then((data) => {
        document.querySelector(".not-found").innerHTML = "";
        e.target.value = "";
        setIsLoading(false);
        return setLocation(data);
      })
      .catch((e) => {
        document.querySelector(".not-found").innerHTML =
          "Ops, something went wrong";
        console.log(e);
      });
    console.log(location);
  }

  useEffect(() => {
    fetch(api("london"), myInit)
      .then((response) => {
        if (!response.ok) {
          throw new Error("bad network request");
        }
        return response.json();
      })
      .then((response) => {
        setLocation(response);
        setIsLoading(false);
        return response;
      })
      .catch((e) => console.log(e));
    console.log(location);
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          fontSize: "30px",
        }}
      >
        <p>Where are u?</p>
        <label class="switch">
          <input type="checkbox"></input>
          <span class="slider round"></span>
        </label>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <img
          style={{ cursor: "pointer" }}
          alt="location access"
          onClick={() => getUserLocation()}
          src="https://img.icons8.com/fluent/48/000000/location.png"
        ></img>
        <input
          style={{ height: "max-content" }}
          placeholder="city..."
          onKeyPress={(e) => (e.key === "Enter" ? getLocation(e) : null)}
        ></input>
        <p className="not-found"></p>
      </div>
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <div>
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                fontSize: "40px",
              }}
            >
              In {location.name}, {location.sys.country}
              <img
                alt="flag"
                src={`https://www.countryflags.io/${location.sys.country}/flat/64.png`}
              ></img>
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {degreeFormat
                ? location.main.temp
                : convertToCelcius(location.main.temp)}{" "}
              {getDegreeFormat()}{" "}
              <img
                alt="weather-icon"
                src={`http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}
              ></img>
            </p>
            <p>
              Feels like {location.main.feels_like}
              {getDegreeFormat()}.
            </p>
            <p>{location.weather[0].description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
