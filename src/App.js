import { useEffect, useState } from "react";
import "./App.css";

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
      return ps;
    });
  }

  const userDeviceLocation = () => {
    if ("geolocation" in window === false) {
      console.log("hi");
      getUserLocation();
    }

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
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(location);
  }, []);

  return (
    <div className="App">
      <div>
        <h1>Where are u?</h1>
      </div>
      <div>
        <button onClick={() => userDeviceLocation()}>location access</button>
        <input
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
            <h3
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              Now in {location.name}, {location.sys.country}
              <img
                alt="flag"
                src={`https://www.countryflags.io/${location.sys.country}/flat/64.png`}
              ></img>
            </h3>
          </div>
          <div>
            <h1
              style={{
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
            </h1>
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
