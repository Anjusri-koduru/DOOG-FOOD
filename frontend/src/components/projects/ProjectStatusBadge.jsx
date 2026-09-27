function ProjectStatusBadge({ status }) {
  const normalizedStatus = String(status || "draft").toLowerCase();

  const statusConfig = {
    draft: {
      label: "Draft",
      className: "status-badge draft",
    },
    submitted: {
      label: "Submitted",
      className: "status-badge submitted",
    },
    withdrawn: {
      label: "Withdrawn",
      className: "status-badge withdrawn",
    },
    pending: {
      label: "Pending",
      className: "status-badge pending",
    },
    approved: {
      label: "Approved",
      className: "status-badge approved",
    },
    rejected: {
      label: "Rejected",
      className: "status-badge rejected",
    },
    completed: {
      label: "Completed",
      className: "status-badge completed",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: normalizedStatus,
    className: "status-badge",
  };

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
}

export default ProjectStatusBadge;