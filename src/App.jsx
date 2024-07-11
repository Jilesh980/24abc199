import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';

const App = () => {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const apiUrl = 'https://aircall-backend.onrender.com/activities';
        const response = await axios.get(apiUrl);
        setCalls(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCalls();
  }, []);

  const handleSelectCall = (call) => {
    setSelectedCall(call);
  };

  const handleArchiveCall = async (id) => {
    try {
      const updatedCalls = calls.map(call =>
        call.id === id ? { ...call, is_archived: !call.is_archived } : call
      );
      setCalls(updatedCalls);
      const apiUrl = `https://aircall-backend.onrender.com/activities/${id}`;
      await axios.patch(apiUrl, { is_archived: !updatedCalls.find(call => call.id === id).is_archived });
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  };

  const handleArchiveAll = async () => {
    try {
      const updatedCalls = calls.map(call => ({ ...call, is_archived: true }));
      setCalls(updatedCalls);
      const apiUrl = 'https://aircall-backend.onrender.com/reset';
      await axios.patch(apiUrl, { is_archived: true });
    } catch (error) {
      console.error('Error archiving all calls:', error);
    }
  };

  const handleUnarchiveAll = async () => {
    try {
      const updatedCalls = calls.map(call => ({ ...call, is_archived: false }));
      setCalls(updatedCalls);
      const apiUrl = 'https://aircall-backend.onrender.com/reset';
      await axios.patch(apiUrl, { is_archived: false });
    } catch (error) {
      console.error('Error unarchiving all calls:', error);
    }
  };

  const filteredCalls = calls.filter(call => call.is_archived === showArchived);

  return (
    <div className='container'>
      <Header />
      <div className="container-view">
        {error && <p>Error fetching calls: {error}</p>}
        {selectedCall ? (
          <div>
            <h2>{selectedCall.from} ➔ {selectedCall.to}</h2>
            <p>{selectedCall.direction} Call {selectedCall.duration} seconds ago</p>
            <button onClick={() => handleArchiveCall(selectedCall.id)}>
              {selectedCall.is_archived ? 'Unarchive' : 'Archive'}
            </button>
            <button onClick={() => setSelectedCall(null)}>Back to List</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setShowArchived(!showArchived)}>
              {showArchived ? 'Show Active Calls' : 'Show Archived Calls'}
            </button>
            <button onClick={showArchived ? handleUnarchiveAll : handleArchiveAll}>
              {showArchived ? 'Unarchive All' : 'Archive All'}
            </button>
            <ul>
              {filteredCalls.map(call => (
                <li key={call.id}>
                  <span onClick={() => handleSelectCall(call)}>
                    {call.direction === 'inbound' && <i className="fa fa-arrow-down" style={{ marginRight: '10px', color: 'green' }}></i>}
                    {call.direction === 'outbound' && <i className="fa fa-arrow-up" style={{ marginRight: '10px', color: 'blue' }}></i>}
                    {call.from} ➔ {call.to}
                  </span>
                  <span>{call.direction} Call {call.duration} seconds ago</span>
                  <button onClick={() => handleArchiveCall(call.id)}>
                    {call.is_archived ? 'Unarchive' : 'Archive'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Bottom navigation icons */}
      <div className="bottom-nav">
        <button className="nav-icon"><i className="fa fa-address-book"></i></button>
        <button className="nav-icon"><i className="fa fa-phone"></i></button>
        <button className="nav-icon"><i className="fa fa-keyboard"></i></button>
        <button className="nav-icon"><i className="fa fa-cog"></i></button> {/* Settings icon */}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

export default App;
