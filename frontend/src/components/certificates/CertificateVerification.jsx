import React from "react";

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString();
}

function CertificateVerification({
  certificate,
  loading = false,
  error = "",
}) {
  if (loading) {
    return (
      <div className="certificate-verification-state">
        <div className="loading-spinner" />
        <p>Verifying certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-verification-state certificate-invalid">
        <h3>Certificate Verification Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!certificate) {
    return null;
  }

  const isValid =
    certificate.isValid !== false;

  const user =
    typeof certificate.user === "object"
      ? certificate.user
      : null;

  const event =
    typeof certificate.event === "object"
      ? certificate.event
      : null;

  const project =
    typeof certificate.project === "object"
      ? certificate.project
      : null;

  return (
    <div
      className={`certificate-verification-card ${
        isValid
          ? "certificate-valid"
          : "certificate-invalid"
      }`}
    >
      <div className="verification-icon">
        {isValid ? "✓" : "!"}
      </div>

      <h2>
        {isValid
          ? "Certificate is Valid"
          : "Certificate is Revoked"}
      </h2>

      <p className="verification-message">
        {isValid
          ? "This certificate has been successfully verified."
          : "This certificate is no longer valid."}
      </p>

      <div className="verification-details">
        <div>
          <span>Certificate ID</span>
          <strong>
            {certificate.certificateId || "—"}
          </strong>
        </div>

        <div>
          <span>Certificate Type</span>
          <strong>
            {certificate.certificateType || "—"}
          </strong>
        </div>

        {user && (
          <div>
            <span>Recipient</span>
            <strong>
              {user.name || user.email || "—"}
            </strong>
          </div>
        )}

        {event && (
          <div>
            <span>Event</span>
            <strong>
              {event.title || event.name || "—"}
            </strong>
          </div>
        )}

        {project && (
          <div>
            <span>Project</span>
            <strong>
              {project.title || "—"}
            </strong>
          </div>
        )}

        {certificate.awardTitle && (
          <div>
            <span>Award</span>
            <strong>
              {certificate.awardTitle}
            </strong>
          </div>
        )}

        {certificate.rank && (
          <div>
            <span>Rank</span>
            <strong>
              #{certificate.rank}
            </strong>
          </div>
        )}

        <div>
          <span>Issued On</span>
          <strong>
            {formatDate(certificate.issuedAt)}
          </strong>
        </div>

        {!isValid &&
          certificate.revokedAt && (
            <div>
              <span>Revoked On</span>
              <strong>
                {formatDate(
                  certificate.revokedAt
                )}
              </strong>
            </div>
          )}

        {!isValid &&
          certificate.revokedReason && (
            <div>
              <span>Revocation Reason</span>
              <strong>
                {certificate.revokedReason}
              </strong>
            </div>
          )}
      </div>
    </div>
  );
}

export default CertificateVerification;