import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StudentCard from './components/StudentCard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import { studentApi } from './services/studentApi';

function App() {
  const [students, setStudents] = useState([]);
  const [displayStudents, setDisplayStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const formRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await studentApi.getAll();
      setStudents(data);
      setDisplayStudents(data);
    } catch (error) {
      showMessage('error', error.message);
      setStudents([]);
      setDisplayStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setDisplayStudents(students);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await studentApi.search(searchQuery.trim());
        setDisplayStudents(results);
      } catch (error) {
        showMessage('error', error.message);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, students]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await studentApi.update(editingStudent.id, formData);
        showMessage('success', 'Student updated successfully.');
        setEditingStudent(null);
      } else {
        await studentApi.create(formData);
        showMessage('success', 'Student added successfully.');
      }
      setSearchQuery('');
      await fetchStudents();
    } catch (error) {
      if (error.details?.length) {
        showMessage('error', error.details.join(' '));
      } else {
        showMessage('error', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    try {
      await studentApi.delete(student.id);
      showMessage('success', 'Student deleted successfully.');
      if (editingStudent?.id === student.id) {
        setEditingStudent(null);
      }
      await fetchStudents();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleAddClick = () => {
    setEditingStudent(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const uniqueDepartments = new Set(students.map((s) => s.department)).size;
  const currentYearStudents = students.filter((s) => s.year === 1).length;

  return (
    <div className="app">
      <Navbar />

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <main className="container">
        <section className="dashboard">
          <StudentCard title="Total Students" value={students.length} icon="👥" />
          <StudentCard title="Departments" value={uniqueDepartments} icon="🏫" />
          <StudentCard title="Current Year Students" value={currentYearStudents} icon="🎓" />
        </section>

        <div ref={formRef}>
          <StudentForm
            onSubmit={handleSubmit}
            editingStudent={editingStudent}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        </div>

        <section className="card search-card">
          <input
            type="text"
            className="search-input"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        <StudentList
          students={displayStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          onAddClick={handleAddClick}
        />
      </main>
    </div>
  );
}

export default App;
