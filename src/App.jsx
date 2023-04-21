import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";

function SpaceXLaunches() {
  const [filter, setFilter] = useState("all");
  const [successFilter, setSuccessFilter] = useState(false);
  const [launches, setLaunches] = useState([]);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get("filter") || "all";
    const urlSuccessFilter = urlParams.get("successFilter") === "true";

    setFilter(urlFilter);
    setSuccessFilter(urlSuccessFilter);
    setLoading(true);
    fetchLaunches(urlFilter, urlSuccessFilter);

    const newUrl = new URL(window.location);
    newUrl.searchParams.set("filter", urlFilter);
    newUrl.searchParams.set("successFilter", urlSuccessFilter);
    window.history.replaceState(null, null, newUrl);
  }, []);

  const fetchLaunches = async (filter, successFilter) => {
    const response = await axios.get(
      `https://api.spacexdata.com/v3/launches${
        filter === "upcoming" ? "/upcoming" : ""
      }`
    );
    const data = response.data;
    setLoading(false);
    setLaunches(
      data.filter((launch) =>
        successFilter ? launch.launch_success : true
      )
    );
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    setLoading(true);
    fetchLaunches(newFilter, successFilter);

    const newUrl = new URL(window.location);
    newUrl.searchParams.set("filter", newFilter);
    newUrl.searchParams.set("successFilter", successFilter);
    window.history.pushState(null, null, newUrl);
  };

  const handleSuccessFilterChange = (event) => {
    const newSuccessFilter = event.target.checked;
    setSuccessFilter(newSuccessFilter);
    setLoading(true);
    fetchLaunches(filter, newSuccessFilter);

    const newUrl = new URL(window.location);
    newUrl.searchParams.set("filter", filter);
    newUrl.searchParams.set("successFilter", newSuccessFilter);
    window.history.pushState(null, null, newUrl);
  };

  const handleLaunchClick = (launch) => {
    setSelectedLaunch(launch);
  };

  const handleCloseModal = () => {
    setSelectedLaunch(null);
  };
  
    return (
      <div className="bcv">
        <h1>SpaceX Dashboard</h1>
        <div className="abc">
          Filter by:{" "}
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
  
        <div>
          <div className="bbc">
            <label>
              Check Here for Successful launch:
              <input
                type="checkbox"
                checked={successFilter}
                onChange={handleSuccessFilterChange}
              />
            </label>
          </div>
        </div>
  
        {loading ? (
          <div>Loading...</div>
        ) : launches.length ? (
          <table>
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>Mission Name</th>
                <th>Launch Date</th>
                <th>Rocket Name</th>
                <th>Launch Site</th>
                <th>Launch Success</th>
                <th>Details</th>
              </tr>
            </thead>
  
            <tbody>
              {launches.map((launch) => (
                <tr key={launch.flight_number}>
                  <td>{launch.flight_number}</td>
                  <td>{launch.mission_name}</td>
                  <td>{launch.launch_date_utc}</td>
                  <td>{launch.rocket.rocket_name}</td>
                  <td>{launch.launch_site.site_name_long}</td>
                  <td>{launch.launch_success ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => handleLaunchClick(launch)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>{filter === "all" ? "No launches found" : "No upcoming launches found"}</div>
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
