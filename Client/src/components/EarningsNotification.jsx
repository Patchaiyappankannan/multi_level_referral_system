import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:5000');  

const EarningsNotification = () => {
  const [userId, setuserId] = useState('');
  const [earnings, setEarnings] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (isRegistered) {
      socket.emit('register-user', userId);

      socket.on('earnings-update', (data) => {
        console.log('Live earnings update:', data);
        setEarnings(data);
      });

      return () => {
        socket.off('earnings-update');  
      };
    }
  }, [isRegistered, userId]);

  const handleRegister = () => {
    if (userId.trim()) {  
      setIsRegistered(true);
    } else {
      alert('Please enter a valid userId');
    }
  };
  

  return (
    <div className="container my-4">
      <h2 className="text-center text-dark mb-4">Real-Time Earnings Updates</h2>

      {!isRegistered ? (
        <div className="text-center mb-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter your userId"
            value={userId}
            onChange={(e) => setuserId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleRegister}>
            Register
          </button>
        </div>
      ) : (
        <div className="row">
          {earnings.length > 0 ? (
            earnings.map((earning) => (
              <div key={earning.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="card shadow-sm p-3" style={{ borderRadius: '8px' }}>
                  <div className="card-body">
                    <h5 className="card-title">Earnings Details</h5>
                    <p className="card-text"><strong>User:</strong> {earning.userId}</p>
                    <p className="card-text"><strong>Referral ID:</strong> {earning.userId}</p>
                    <p className="card-text"><strong>Amount Earned:</strong> ₹{earning.amount}</p>
                    <p className="card-text"><strong>Level:</strong> {earning.level}</p>
                    <p className="card-text"><strong>Transaction ID:</strong> {earning.transactionId}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center text-muted">No earnings updates yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EarningsNotification;
