import "../styles/progress.css";

function ProgressCircle({ label, solved, total }) {
  const percent = ((solved / total) * 100).toFixed(0);
  const circumference = 314;

  return (
    <div className="circle-wrapper">
      <svg width="120" height="120">
        <circle className="bg-circle" cx="60" cy="60" r="50" />
        <circle
          className="fg-circle"
          cx="60"
          cy="60"
          r="50"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * percent) / 100}
        />
      </svg>

      <div className="circle-info">
        <strong>{label}</strong>
        <p>
          {solved}/{total}
        </p>
      </div>
    </div>
  );
}

export default ProgressCircle;
