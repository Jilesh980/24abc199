import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import { getActivities, updateActivity, resetCalls } from './api'; // Import API functions

const App = () => {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const data = await getActivities();
        setCalls(data);
      } catch (error) {
        console.error('Error fetching call data:', error);
      }
    };

    fetchCalls();
  }, []);

  const handleSelectCall = (call) => {
    setSelectedCall(call);
  };

  const handleArchiveCall = async (id) => {
    try {
      // Update locally first
      const updatedCalls = calls.map(call =>
        call.id === id ? { ...call, is_archived: !call.is_archived } : call
      );
      setCalls(updatedCalls);

      // Update on the server
      await updateActivity(id, { is_archived: !calls.find(call => call.id === id).is_archived });
    } catch (error) {
      console.error('Error updating call:', error);
    }
  };

  const handleArchiveAll = async () => {
    try {
      await resetCalls(); // Assuming this resets all calls to initial state
      const updatedCalls = calls.map(call => ({ ...call, is_archived: true }));
      setCalls(updatedCalls);
    } catch (error) {
      console.error('Error archiving all calls:', error);
    }
  };

  const handleUnarchiveAll = async () => {
    try {
      await resetCalls(); // Assuming this resets all calls to initial state
      const updatedCalls = calls.map(call => ({ ...call, is_archived: false }));
      setCalls(updatedCalls);
    } catch (error) {
      console.error('Error unarchiving all calls:', error);
    }
  };

  const filteredCalls = calls.filter(call => call.is_archived === showArchived);

  return (
    <div className='container'>
      <Header />
      <div className="container-view">
        {selectedCall ? (
          <div>
            <h2>{selectedCall.title}</h2>
            <p>{selectedCall.description}</p>
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
                    {call.from} to {call.to}
                  </span>
                  <span>{call.description}</span>
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
