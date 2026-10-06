import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  fetchEmployees,
  selectEmployees,
  selectLoading,
  selectError,
} from '../redux/employeedetails/employeeDetails';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  position: '',
  department: '',
};

function EmployeeForm() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const firstNameRef = useRef(null);
  const listHeadingRef = useRef(null);

  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Load the list from the API when the component mounts
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateEmployee(editingId, form));
        setStatus(`${form.firstName} ${form.lastName} updated.`);
      } else {
        await dispatch(addEmployee(form));
        setStatus(`${form.firstName} ${form.lastName} added.`);
      }
      setForm(emptyForm);
      setEditingId(null);
      firstNameRef.current.focus();
    } catch (err) {
      setStatus(`Could not save: ${err.message}`);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      position: emp.position,
      department: emp.department,
    });
    setStatus(`Editing ${emp.firstName} ${emp.lastName}.`);
    firstNameRef.current.focus();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setStatus('Edit cancelled.');
    firstNameRef.current.focus();
  };

  const handleDelete = async (emp) => {
    try {
      await dispatch(deleteEmployee(emp.id));
      setStatus(`${emp.firstName} ${emp.lastName} deleted.`);
      listHeadingRef.current.focus(); // the deleted button no longer exists
    } catch (err) {
      setStatus(`Could not delete: ${err.message}`);
    }
  };

  return (
    <main className="container">
      <h1>Employee Management</h1>

      {/* Always in the DOM so screen readers announce changes */}
      <div role="status" aria-live="polite" className="status">
        {status}
      </div>

      <section className="card" aria-labelledby="form-heading">
        <h2 id="form-heading">{editingId ? 'Edit Employee' : 'Add Employee'}</h2>
        <p>
          Fields marked <span className="required" aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              ref={firstNameRef}
              type="text"
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">
              Position <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              autoComplete="organization-title"
              value={form.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">
              Department <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Submit'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card" aria-labelledby="list-heading">
        <h2 id="list-heading" ref={listHeadingRef} tabIndex={-1}>
          Employee List
        </h2>

        {loading && <p role="status">Loading employees...</p>}
        {error && <p role="alert">Could not load employees: {error}</p>}

        {!loading && !error && employees.length === 0 && (
          <p className="text-muted">No employees yet.</p>
        )}

        {!loading && !error && employees.length > 0 && (
          <div
            className="table-wrap"
            role="region"
            aria-label="Employee table, scrollable"
            tabIndex={0}
          >
            <table className="table">
              <caption className="sr-only">List of employees</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Position</th>
                  <th scope="col">Department</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const fullName = `${emp.firstName} ${emp.lastName}`;
                  return (
                    <tr key={emp.id}>
                      <th scope="row">{fullName}</th>
                      <td>{emp.email}</td>
                      <td>{emp.position}</td>
                      <td>{emp.department}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(emp)}
                            aria-label={`Edit ${fullName}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(emp)}
                            aria-label={`Delete ${fullName}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default EmployeeForm;