import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  department: '',
  year: '',
  section: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const phoneDigits = form.phone.replace(/[\s\-()]/g, '');
  if (phoneDigits && !PHONE_REGEX.test(phoneDigits)) {
    errors.phone = 'Phone must contain 7 to 15 digits.';
  }

  if (!form.department.trim()) {
    errors.department = 'Department is required.';
  }

  const yearNum = Number(form.year);
  if (!form.year) {
    errors.year = 'Year is required.';
  } else if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 6) {
    errors.year = 'Year must be between 1 and 6.';
  }

  return errors;
}

function StudentForm({ onSubmit, editingStudent, onCancel, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        department: editingStudent.department || '',
        year: String(editingStudent.year || ''),
        section: editingStudent.section || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    if (onCancel) onCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      year: Number(form.year),
      section: form.section.trim(),
    });
  };

  const isEditing = Boolean(editingStudent);

  return (
    <section className="card form-card">
      <h2>{isEditing ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <select id="year" name="year" value={form.year} onChange={handleChange}>
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
              <option value="6">6th Year</option>
            </select>
            {errors.year && <span className="field-error">{errors.year}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="section">Section</label>
            <input
              type="text"
              id="section"
              name="section"
              value={form.section}
              onChange={handleChange}
              placeholder="e.g. A"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={isSubmitting}>
            {isEditing ? 'Cancel' : 'Clear'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default StudentForm;
