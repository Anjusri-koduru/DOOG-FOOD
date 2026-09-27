import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import judgeService from "../../services/judgeService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatCard from "../../components/dashboard/StatCard";

function JudgeDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await judgeService.getMyAssignments();

      const data =
        response?.data?.assignments ||
        response?.data ||
        response?.assignments ||
        [];

      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load judge assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  const assignedCount = assignments.filter(
    (item) => item.status === "assigned"
  ).length;

  const inProgressCount = assignments.filter(
    (item) => item.status === "in_progress"
  ).length;

  const completedCount = assignments.filter(
    (item) => item.status === "completed"
  ).length;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "38px",
                lineHeight: "1",
              }}
            >
              ⚖️
            </span>

            <h1 style={{ margin: 0 }}>
              Judge Dashboard
            </h1>
          </div>

          <p>
            Manage your hackathon project judging assignments.
          </p>
        </div>

        <Link
          to="/judge/assignments"
          className="btn btn-primary"
        >
          📋 My Assignments
        </Link>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <ErrorMessage message={error} />
      )}


      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="dashboard-stats">

        <StatCard
          title="Total Assignments"
          value={assignments.length}
          icon="📋"
        />

        <StatCard
          title="Assigned"
          value={assignedCount}
          icon="📝"
        />

        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon="⏳"
        />

        <StatCard
          title="Completed"
          value={completedCount}
          icon="✅"
        />

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="dashboard-section">

        <div className="section-header">
          <h2>
            ⚡ Quick Actions
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >

          <Link
            to="/judge/assignments"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                📋
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                }}
              >
                My Assignments
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                View projects assigned to you.
              </p>
            </div>
          </Link>


          <Link
            to="/judge/scores"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                ⭐
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                }}
              >
                My Scores
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                Review your submitted evaluation scores.
              </p>
            </div>
          </Link>

        </div>

      </div>


      {/* =====================================================
          RECENT ASSIGNMENTS
      ====================================================== */}

      <div className="dashboard-section">

        <div className="section-header">

          <h2>
            📋 Recent Assignments
          </h2>

          <Link to="/judge/assignments">
            View All →
          </Link>

        </div>


        {assignments.length === 0 ? (

          <div className="empty-state">

            <div
              style={{
                fontSize: "50px",
                marginBottom: "10px",
              }}
            >
              📭
            </div>

            <h3>
              No assignments yet
            </h3>

            <p>
              You don't have any judging assignments at the moment.
            </p>

          </div>

        ) : (

          <div className="judge-assignment-list">

            {assignments
              .slice(0, 5)
              .map((assignment) => (

                <div
                  key={assignment._id}
                  className="simple-assignment-row"
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >

                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f3f4f6",
                        fontSize: "21px",
                      }}
                    >
                      💻
                    </div>

                    <div>

                      <strong>
                        {assignment?.project?.title ||
                          "Project"}
                      </strong>

                      <span
                        style={{
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {assignment?.event?.title ||
                          "Event"}
                      </span>

                    </div>

                  </div>


                  <span
                    className={`assignment-status ${
                      assignment?.status || "assigned"
                    }`}
                  >
                    {assignment?.status === "in_progress"
                      ? "In Progress"
                      : assignment?.status === "completed"
                      ? "Completed"
                      : "Assigned"}
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default JudgeDashboard;