import "../assets/styles/admin.css";

export default function Admin() {

  return (

    <div className="admin-page">

      <h1>Admin Dashboard</h1>

      <div className="admin-grid">

        <div className="admin-card">
          <h2>1500+</h2>
          <p>Total Users</p>
        </div>

        <div className="admin-card">
          <h2>250+</h2>
          <p>Recruiters</p>
        </div>

        <div className="admin-card">
          <h2>500+</h2>
          <p>Jobs Posted</p>
        </div>

        <div className="admin-card">
          <h2>3200+</h2>
          <p>Applications</p>
        </div>

      </div>

    </div>
  );
}