import { useLocation } from 'react-router-dom';

export function useCanGoBack() {
  // We can use window.history.state to check if there is a previous entry in the history stack
  // specifically within this SPA. React Router's history assigns an 'idx' to state.
  return window.history.state?.idx > 0;
}
