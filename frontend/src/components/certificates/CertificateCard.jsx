import { Link } from "react-router-dom";
import DownloadCertificateButton from "./DownloadCertificateButton";

function CertificateCard({
  certificate,
  showRevoke = false,
  onRevoke,
}) {
  if (!certificate) {
    return null;
  }

  const certificateId = certificate.certificateId;

  const recipientName =
    certificate.user?.name ||
    certificate.team?.name ||
    "Participant";

  const eventTitle =
    certificate.event?.title ||
    "DOGFOOD Hackathon";

  const certificateType =
    certificate.certificateType
      ?.replace(/_/g, " ")
      .toUpperCase() || "CERTIFICATE";

  const issuedDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-IN")
    : "N/A";

  const isValid = certificate.isValid !== false;

  return (
    <div className="certificate-card">
      <div className="certificate-card-header">
        <div>
          <span className="certificate-label">
            DOGFOOD
          </span>

          <h3>{certificateType}</h3>
        </div>

        <span
          className={
            isValid
              ? "certificate-status valid"
              : "certificate-status revoked"
          }
        >
          {isValid ? "VALID" : "REVOKED"}
        </span>
      </div>

      <div className="certificate-card-body">
        <p>
          <strong>Certificate ID:</strong>{" "}
          {certificateId}
        </p>

        <p>
          <strong>Recipient:</strong>{" "}
          {recipientName}
        </p>

        <p>
          <strong>Event:</strong>{" "}
          {eventTitle}
        </p>

        {certificate.project?.title && (
          <p>
            <strong>Project:</strong>{" "}
            {certificate.project.title}
          </p>
        )}

        {certificate.awardTitle && (
          <p>
            <strong>Award:</strong>{" "}
            {certificate.awardTitle}
          </p>
        )}

        {certificate.rank && (
          <p>
            <strong>Rank:</strong>{" "}
            {certificate.rank}
          </p>
        )}

        <p>
          <strong>Issued:</strong>{" "}
          {issuedDate}
        </p>
      </div>

      <div className="certificate-card-actions">
        <Link
          to={`/verify-certificate?certificateId=${encodeURIComponent(
            certificateId
          )}`}
          className="btn btn-secondary"
        >
          Verify
        </Link>

        {isValid && (
          <DownloadCertificateButton
            certificateId={certificateId}
          />
        )}

        {showRevoke && isValid && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onRevoke?.(certificate)}
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}

export default CertificateCard;