import { useEffect, useState } from "react";
import "./App.css";
import React from "react";
import Header from "./components/Header";
import LocationInfo from "./components/LocationInfo";
import SwitchButton from "./components/SwitchButton";

function App() {
  const [location, setLocation] = useState({});
  const [degreeFormat, setDegreeFormat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceLocation, setDeviceLocation] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [hour, setHour] = useState("");

  const api = (v) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${v}&appid=3069ae2718e40f8dc1998b7250e16f10&units=metric`;
  const myInit = { mode: "cors" };
  const myRequest = (v) => new Request(api(v), myInit);

  const toggleFormat = () => setDegreeFormat(!degreeFormat);

  setInterval(() => {
    var date = new Date();
    setHour(
      date.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, 1000);

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

  async function fetchResults() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${deviceLocation[0]}&lon=${deviceLocation[1]}&appid=3069ae2718e40f8dc1998b7250e16f10&units=metric`,
        myInit
      );
      const data = await response.json();
      setErrorLoading(false);
      setIsLoading(false);
      setLocation(data);
    } catch (e) {
      setErrorLoading(true);
      console.error(e);
    }
  }

  async function getLocation(e) {
    setIsLoading(true);
    try {
      const response = await fetch(myRequest(e.target.value));
      const data = await response.json();
      setErrorLoading(false);
      setIsLoading(false);
      e.target.value = "";
      setLocation(data);
    } catch (e) {
      setErrorLoading(true);
      console.error(e);
    }
  }

  // async function getInitialLocation() {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(api("london"), myInit);
  //     const data = await response.json();
  //     setErrorLoading(false);
  //     setIsLoading(false);
  //     setLocation(data);
  //   } catch (e) {
  //     setErrorLoading(true);
  //     console.error(e);
  //   }
  // }

  useEffect(() => {
    setIsLoading(true);
    // getInitialLocation();

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
  }, []);

  return (
    <div>
      <div className="App">
        <Header
          errorLoading={errorLoading}
          getUserLocation={getUserLocation}
          getLocation={(e) => getLocation(e)}
        />
        {isLoading ? (
          <p style={{ fontSize: "40px" }}>Loading ...</p>
        ) : (
          <div>
            <LocationInfo degreeFormat={degreeFormat} location={location} />
            <SwitchButton
              toggleFormat={() => toggleFormat()}
              degreeFormat={degreeFormat}
            />
            <p>{hour}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
