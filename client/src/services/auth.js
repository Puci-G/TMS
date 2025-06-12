export const login = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user',  JSON.stringify(user));

};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

