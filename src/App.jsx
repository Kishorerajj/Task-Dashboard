import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css"
function SpaceXLaunches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [successFilter, setSuccessFilter] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  useEffect(() => {
    setLoading(true);
    let url = "https://api.spacexdata.com/v3/launches";
     if (filter === "upcoming") {
       url += "/upcoming";
     } else if (filter === "past") {
       url += "/past";
     }
     if (successFilter) {
       url += "?launch_success=true";
     }
    axios.get(url)
      .then(response => {
        setLaunches(response.data);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, [filter, successFilter]);


  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const handleSuccessFilterChange = event => {
    setSuccessFilter(event.target.checked);
  };

  const handleLaunchClick = launch => {
    setSelectedLaunch(launch);
  };

  const handleCloseModal = () => {
    setSelectedLaunch(null);
  };

  return (
    <div className="bcv">
      <h1 >SpaceX Dashboard</h1>
      <div className="abc">
        Filter by:{" "}
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>
      
      <div >
         <div className="bbc">
         <label>
           Check Here for Successful launch:
          <input type="checkbox" checked={successFilter} onChange={handleSuccessFilterChange} />
        </label>
         </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th >Flight Number</th>
              <th >Mission Name</th>
              <th >Launch Date</th>
              <th >Rocket Name</th>
              <th >Launch Site</th>
              <th >Launch Success</th>
              <th >Details</th>
            </tr>
          </thead>
      
          <tbody> 
            { launches.map(launch => (
              <tr key={launch.flight_number}>
                <td >{launch.flight_number}</td>
                <td >{launch.mission_name}</td>
                <td >{launch.launch_date_utc}</td>
                <td >{launch.rocket.rocket_name}</td>
                <td >{launch.launch_site.site_name_long}</td>
                <td >{launch.launch_success ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleLaunchClick(launch)}>View Details</button>
                </td>
              </tr>
 
            ))}
          </tbody>
        
        </table>
      )}
      {selectedLaunch && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedLaunch.mission_name}</h2>
            <p>{selectedLaunch.details}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpaceXLaunches;
