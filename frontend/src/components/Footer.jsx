import React from 'react';

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-logo">  
          <img src="/logo-small.png" alt="SmallBiz Platform Logo" />
        </div>
        <nav className="footer-nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/help">Help Center</a>
        </nav>
        <div className="footer-social">
          <a href="https://facebook.com/smallbizplatform" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
          <a href="https://instagram.com/smallbizplatform" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
        </div>
        <div className="footer-newsletter">
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Subscribe to newsletter" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div className="footer-copy">
          © 2025 SmallBiz Platform. All rights reserved.
        </div>
      </footer>
    </>
  );
}
