document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const usernameInput = document.getElementById('newUsername');
  const passwordInput = document.getElementById('newPassword');
  const message = document.getElementById('registerMessage');

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validação de senha
    if (password.length < 6) {
      message.textContent = 'A senha deve ter no mínimo 6 caracteres.';
      message.style.color = 'red';
      return;
    }

    // Verifica se há usuários já cadastrados
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o nome de usuário já está em uso
    const jaExiste = usuarios.some(u => u.usuario.toLowerCase() === username.toLowerCase());

    if (jaExiste) {
      message.textContent = 'Usuário já existe. Escolha outro nome.';
      message.style.color = 'red';
      return;
    }

    // Salva o novo usuário
    usuarios.push({ usuario: username, senha: password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    message.textContent = '✅ Cadastro realizado com sucesso! Agora faça login.';
    message.style.color = 'green';

    registerForm.reset();
  });

  // Também permite envio com tecla Enter dentro do campo de senha
  passwordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      registerForm.dispatchEvent(new Event('submit'));
    }
  });
});
