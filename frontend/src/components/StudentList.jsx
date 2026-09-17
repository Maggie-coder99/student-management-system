function StudentList({ students, onEdit, onDelete, isLoading, onAddClick }) {
  if (isLoading) {
    return (
      <section className="card list-card">
        <p className="loading-text">Loading...</p>
      </section>
    );
  }

  if (students.length === 0) {
    return (
      <section className="card list-card">
        <div className="empty-state">
          <p>No students found.</p>
          <button className="btn btn-primary" onClick={onAddClick}>
            Add a Student
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card list-card">
      <h2>Student List</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Year</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone || '—'}</td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>{student.section || '—'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(student)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => onDelete(student)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StudentList;
