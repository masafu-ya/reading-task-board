type ErrorAlertProps = {
  message: string;
  hint?: string;
};

export default function ErrorAlert({ message, hint }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
      {hint && <p className="mt-1 text-xs text-red-600">{hint}</p>}
    </div>
  );
}
