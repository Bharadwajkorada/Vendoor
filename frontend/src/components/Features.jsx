import React from 'react';


const features = [
  { icon: '🛍️', text: 'Easy Product Listing' },
  { icon: '📦', text: 'Real-Time Inventory Tracking' },
  { icon: '📊', text: 'Business Analytics Dashboard' },
  { icon: '??', text: 'choose correctly this need to fixed' }
//   { icon: '👨‍👩‍👧‍👦', text: 'No Customer Account Needed to Buy' },
//   { icon: '🔒', text: 'Secure Payments (if implemented)' },
//   { icon: '🌍', text: 'Local Business Visibility' }
];

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Our Platform?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-text">{feature.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
