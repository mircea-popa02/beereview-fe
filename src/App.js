import { useEffect } from 'react';
import './App.css';
import { useState } from 'react';

function App() {
  const [breweries, setBreweries] = useState([]);
  useEffect(() => {
    // localhost:5000/breweries
    fetch('http://localhost:5000/breweries')
      .then((res) => res.json())
      .then((data) => console.log(data));
  });

  return (
    <div>
      <h1>Breweries</h1>
      <ul>
        {breweries.map((brewery) => (
          <li key={brewery.id}>{brewery.name}</li>
        ))}
      </ul>
    </div>
  );

}

export default App;
