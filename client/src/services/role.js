export const getRole  = () => JSON.parse(localStorage.getItem('user') || '{}').role;
export const isAdmin  = () => getRole() === 'admin';
export const isManager= () => getRole() === 'manager';
export const canManage= () => ['admin','manager'].includes(getRole());
