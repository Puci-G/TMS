import { getRole } from '../services/role';

export default function Protected({ allow = [], children }) {
  return allow.includes(getRole()) ? children : null;
}
