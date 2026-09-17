function StudentCard({ title, value, icon }) {
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>
      <div className="summary-info">
        <span className="summary-value">{value}</span>
        <span className="summary-title">{title}</span>
      </div>
    </div>
  );
}

export default StudentCard;
