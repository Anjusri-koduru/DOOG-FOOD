function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>DOGFOOD</h3>
          <p>
            Hackathon Management & Judging Platform
          </p>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} DOGFOOD. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;