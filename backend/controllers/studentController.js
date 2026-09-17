const { getDb } = require('../database/database');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;

function validateStudent(data) {
  const errors = [];

  const name = data.name?.trim();
  const email = data.email?.trim();
  const phone = data.phone?.trim() || '';
  const department = data.department?.trim();
  const year = data.year;
  const section = data.section?.trim() || '';

  if (!name) {
    errors.push('Name is required.');
  }

  if (!email) {
    errors.push('Email is required.');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Email must be a valid email address.');
  }

  if (phone && !PHONE_REGEX.test(phone.replace(/[\s\-()]/g, ''))) {
    errors.push('Phone must contain 7 to 15 digits.');
  }

  if (!department) {
    errors.push('Department is required.');
  }

  const yearNum = Number(year);
  if (year === undefined || year === null || year === '') {
    errors.push('Year is required.');
  } else if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 6) {
    errors.push('Year must be a valid student year (1-6).');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      name,
      email,
      phone: phone.replace(/[\s\-()]/g, '') || null,
      department,
      year: yearNum,
      section: section || null,
    },
  };
}

function getAllStudents(req, res) {
  try {
    const { queryAll } = getDb();
    const students = queryAll('SELECT * FROM students ORDER BY id DESC');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
}

function getStudentById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID.' });
    }

    const { queryOne } = getDb();
    const student = queryOne('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
}

function createStudent(req, res) {
  try {
    const validation = validateStudent(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Please check the entered information.',
        details: validation.errors,
      });
    }

    const { name, email, phone, department, year, section } = validation.sanitized;
    const { queryOne, run } = getDb();

    const existing = queryOne('SELECT id FROM students WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }

    const result = run(
      `INSERT INTO students (name, email, phone, department, year, section)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, department, year, section]
    );

    const student = queryOne('SELECT * FROM students WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(student);
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student.' });
  }
}

function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID.' });
    }

    const { queryOne, run } = getDb();
    const existing = queryOne('SELECT * FROM students WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const validation = validateStudent(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Please check the entered information.',
        details: validation.errors,
      });
    }

    const { name, email, phone, department, year, section } = validation.sanitized;

    const emailConflict = queryOne('SELECT id FROM students WHERE email = ? AND id != ?', [
      email,
      id,
    ]);
    if (emailConflict) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }

    run(
      `UPDATE students
       SET name = ?, email = ?, phone = ?, department = ?, year = ?, section = ?
       WHERE id = ?`,
      [name, email, phone, department, year, section, id]
    );

    const student = queryOne('SELECT * FROM students WHERE id = ?', [id]);
    res.json(student);
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student.' });
  }
}

function deleteStudent(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID.' });
    }

    const { queryOne, run } = getDb();
    const existing = queryOne('SELECT * FROM students WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    run('DELETE FROM students WHERE id = ?', [id]);
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student.' });
  }
}

function searchStudents(req, res) {
  try {
    const keyword = req.query.q?.trim();
    if (!keyword) {
      return res.status(400).json({ error: 'Search keyword is required.' });
    }

    const { queryAll } = getDb();
    const pattern = `%${keyword}%`;
    const students = queryAll(
      `SELECT * FROM students
       WHERE name LIKE ? OR email LIKE ? OR department LIKE ?
       ORDER BY id DESC`,
      [pattern, pattern, pattern]
    );

    res.json(students);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ error: 'Failed to search students.' });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
};
