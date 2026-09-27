function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="error-message">
      <div>
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;