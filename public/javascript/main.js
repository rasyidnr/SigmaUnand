function togglePassword() {
  const input = document.getElementById('password');
  const icon = document.getElementById('toggleIcon');

  if (!input || !icon) return;

  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
}
