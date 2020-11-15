import { useEffect, useState } from "react";
import "./App.css";
import React from "react";

function App() {
  const [location, setLocation] = useState({});
  const [degreeFormat, setDegreeFormat] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceLocation, setDeviceLocation] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [date, setDate] = useState("");

  const api = (v) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${v}&appid=3069ae2718e40f8dc1998b7250e16f10`;
  const myInit = { mode: "cors" };
  const myRequest = (v) => new Request(api(v), myInit);

  const getDegreeFormat = () => (degreeFormat ? "°F" : "°C");
  const convertToFarenheits = (v) => Math.round(((v - 273.15) * 9) / 5 + 32);
  const convertToCelcius = (v) => Math.round(v - 273.15);
  const convertToLocalTime = (v) => {
    return new Date(v).toLocaleString();
  };

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

  const getDate = () => {
    var date = new Date();
    setDate(
      date.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  setInterval(() => {
    getDate();
  }, 1000);

  function fetchResults() {
    setIsLoading(true);
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
        setErrorLoading(false);
        setIsLoading(false);
        return setLocation(data);
      })
      .catch((e) => {
        setErrorLoading(true);
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
        setErrorLoading(false);
        setIsLoading(false);
        e.target.value = "";
        return setLocation(data);
      })
      .catch((e) => {
        setErrorLoading(true);
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
        {/* <p>Weather App</p> */}
        {/* <p>🌞 ☁️ ⛈️ ☂️ ❄️ ⛱️ 🌊 </p> */}
        <img
          style={{ width: "60px" }}
          alt="app-logo"
          src="https://www.feirox.com/rivu/2016/04/Klara-1-1.png"
        ></img>
        <p>Current Weather</p>
      </div>
      <br></br>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <img
          style={{ cursor: "pointer", width: "30px" }}
          alt="location access"
          onClick={() => getUserLocation()}
          src="https://img.icons8.com/ios-filled/50/000000/marker.png"
        ></img>
        <input
          style={{ height: "max-content" }}
          placeholder="city..."
          onKeyPress={(e) =>
            e.key === "Enter" && e.target.value !== "" ? getLocation(e) : null
          }
        ></input>
      </div>
      <p className="not-found">
        {errorLoading ? "Ops, something went wrong" : null}
      </p>
      {isLoading ? (
        <p style={{ fontSize: "40px" }}>Loading ...</p>
      ) : (
        <div>
          <div className="location-info">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                fontSize: "40px",
                margin: "0px",
              }}
            >
              <p style={{ margin: 0 }}>
                {location.name}, {location.sys.country}
              </p>
              <img
                alt="flag"
                src={`https://www.countryflags.io/${location.sys.country}/flat/64.png`}
              ></img>
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
                  ? convertToFarenheits(Math.round(location.main.temp))
                  : convertToCelcius(Math.round(location.main.temp))}
                {getDegreeFormat()}
                <img
                  alt="weather-icon"
                  src={`http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}
                ></img>
              </p>
              <p>
                Feels like{" "}
                {degreeFormat
                  ? convertToFarenheits(Math.round(location.main.feels_like))
                  : convertToCelcius(Math.round(location.main.feels_like))}
                {getDegreeFormat()} | {location.weather[0].description} |
                Humidity: {location.main.humidity}%
              </p>
              <p>
                Sunrise:{" "}
                {() => {
                  convertToLocalTime(location.sys.sunrise);
                }}
              </p>
              <p>Sunset: {}</p>
              <br></br>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <label class="switch">
              <input
                onChange={() => setDegreeFormat(!degreeFormat)}
                checked={degreeFormat}
                type="checkbox"
              ></input>
              <span
                class="slider round"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    color: "black",
                    zIndex: 2,
                    position: "relative",
                    fontSize: "12px",
                  }}
                >
                  <span>C</span>
                  <span>F</span>
                </div>
              </span>
            </label>
          </div>
          <p>{date}</p>
        </div>
      )}
    </div>
  );
}

export default App;
