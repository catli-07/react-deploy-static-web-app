import * as api from '../../api';

// Action types
export const SET_EMPLOYEES = 'employee/set';
export const SET_LOADING = 'employee/loading';
export const SET_ERROR = 'employee/error';

// Plain actions
const setEmployees = (employees) => ({ type: SET_EMPLOYEES, payload: employees });
const setLoading = (value) => ({ type: SET_LOADING, payload: value });
const setError = (message) => ({ type: SET_ERROR, payload: message });

// Thunks
// GET: silent = true skips the "Loading..." state (used when refreshing after a change)
export const fetchEmployees = (silent = false) => async (dispatch) => {
  if (!silent) dispatch(setLoading(true));
  try {
    dispatch(setEmployees(await api.getEmployees()));
    dispatch(setError(null));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// POST
export const addEmployee = (employee) => async (dispatch) => {
  await api.createEmployee(employee);
  await dispatch(fetchEmployees(true));
};

// PUT
export const updateEmployee = (id, changes) => async (dispatch) => {
  await api.updateEmployee(id, changes);
  await dispatch(fetchEmployees(true));
};

// DELETE
export const deleteEmployee = (id) => async (dispatch) => {
  await api.deleteEmployee(id);
  await dispatch(fetchEmployees(true));
};

// Selectors
export const selectEmployees = (state) => state.employee.employees;
export const selectLoading = (state) => state.employee.loading;
export const selectError = (state) => state.employee.error;

const initialState = {
  employees: [],
  loading: true,
  error: null,
};

// Reducer
export default function employeeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EMPLOYEES:
      return { ...state, employees: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}