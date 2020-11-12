import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState({});
  const api = (v) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${v}&appid=3069ae2718e40f8dc1998b7250e16f10`;
  const myInit = { mode: "cors" };
  const myRequest = new Request(api("jerusalem"), myInit);

  function getLocation(e) {
    fetch(api(e.target.value), myInit)
      .then((response) => {
        if (!response.ok) {
          throw new Error("bad network request");
        }
        return response.json();
      })
      .then((data) => {
        e.target.value = "";
        return setLocation(data);
      })
      .catch((e) => console.log(e));
    console.log(location);
  }

  useEffect(() => {
    fetch(myRequest)
      .then((response) => {
        if (!response.ok) {
          throw new Error("bad network request");
        }
        return response.json();
      })
      .then((response) => {
        return setLocation(response);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="App">
      <div>
        <h1>where are u?</h1>
      </div>
      <div>
        <input
          onKeyPress={(e) => (e.key === "Enter" ? getLocation(e) : null)}
        ></input>
      </div>
      <p>{location.name}</p>
    </div>
  );
}

export default App;

/*
    Set up a blank HTML document with the appropriate links to your JavaScript and CSS files.
    Write the functions that hit the API. You’re going to want functions that can take a location 
    and return the weather data for that location. 
    For now, just console.log() the information.
    Write the functions that process the JSON data you’re getting from the API and return an object 
    with only the data you require for your app.
    Set up a simple form that will let users input their location and will fetch the weather info 
    (still just console.log() it).
    Display the information on your webpage!
    Add any styling you like!
    Optional: add a ‘loading’ component that displays from the time the form is submitted until 
    the information comes back from the API.
    Push that baby to github and share your solution below!
*/
