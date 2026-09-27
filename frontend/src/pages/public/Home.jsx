import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">
          Hackathon Management Platform
        </span>

        <h1>
          Build the Platform
          <br />
          That Will Judge You.
        </h1>

        <p>
          DOGFOOD is a complete platform for managing
          hackathons, teams, projects, judges, scoring,
          voting and certificates.
        </p>

        <div className="hero-actions">
          <Link
            to="/events"
            className="btn btn-primary"
          >
            Explore Events
          </Link>

          <Link
            to="/register"
            className="btn btn-secondary"
          >
            Join DOGFOOD
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;