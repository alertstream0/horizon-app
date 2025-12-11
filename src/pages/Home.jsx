import { useState } from 'react';

const Home = () => {
  return (
    <div className="home-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Welcome to Horizon
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
        A premium React application boilerplated and ready for your next big idea.
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        <button className="btn btn-primary" onClick={() => alert('Ready to build!')}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
