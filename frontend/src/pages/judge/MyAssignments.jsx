import { useEffect, useState } from "react";

import judgeService from "../../services/judgeService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import JudgeAssignmentCard from "../../components/judging/JudgeAssignmentCard";

function MyAssignments() {
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

      const response =
        await judgeService.getMyAssignments();

      const data =
        response?.data?.assignments ||
        response?.data ||
        response?.assignments ||
        [];

      setAssignments(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>My Assignments</h1>

          <p>
            Projects assigned to you for judging.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadAssignments}
        >
          Refresh
        </button>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      {!error && assignments.length === 0 ? (
        <EmptyState
          title="No assignments"
          message="You don't have any judging assignments yet."
        />
      ) : (
        <div className="judge-assignments-grid">

          {assignments.map((assignment) => (
            <JudgeAssignmentCard
              key={assignment._id}
              assignment={assignment}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default MyAssignments;