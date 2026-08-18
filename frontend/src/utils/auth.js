export const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  window.location.hash = '#/'
}

