document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: username, senha: password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("usuarioLogado", username);
        localStorage.setItem("token", data.token); // <-- Nome padronizado
        window.location.href = "admin-vendas.html";
      } else {
        message.textContent = data.msg || "Usuário ou senha inválidos!";
        message.style.color = "red";
      }
    } catch (error) {
      message.textContent = "Erro ao conectar com o servidor.";
      message.style.color = "red";
      console.error("Erro de login:", error);
    }
  });
});
