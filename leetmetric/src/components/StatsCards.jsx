import "../styles/cards.css";

function StatsCards({ data }) {
  return (
    <div className="cards-container">
      {data.map((item, i) => (
        <div className="card" key={i}>
          <h4>{item.label}</h4>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
