document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#login-form"); // Select the form by its ID
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Get values using name attributes
    const email = form
      .querySelector('input[name="email"]')
      ?.value.trim()
      .toLowerCase();
    const password = form.querySelector('input[name="password"]')?.value;
    const message = form.querySelector(".form-message"); // Select the message element within the form

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      showMessage("Email hoặc mật khẩu không đúng.", "error", message); // Pass message element
      return;
    }
    // Save login status
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name: user.name, email: user.email })
    );
    showMessage("Đăng nhập thành công! Đang chuyển hướng...", "success", message); // Pass message element
    setTimeout(() => {
      window.location.href = "/index.html"; // Redirect to homepage or desired page
    }, 1200);
  });

  // Pass the message element to the showMessage function
  function showMessage(msg, type, messageElement) {
    if (messageElement) {
      messageElement.textContent = msg;
      messageElement.style.color = type === "success" ? "#4caf50" : "#e53935";
    }
  }
});