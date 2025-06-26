document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#register-form"); // Select the form by its ID
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Get values using name attributes
    const name = form
      .querySelector('input[name="full-name"]') // Updated to use 'full-name' name attribute
      ?.value.trim();
    const email = form
      .querySelector('input[name="email"]')
      ?.value.trim()
      .toLowerCase();
    const password = form.querySelector('input[name="password"]')?.value;
    const confirm = form.querySelector('input[name="confirm-password"]')?.value;
    const message = form.querySelector(".form-message"); // Select the message element within the form

    if (!name || !email || !password || !confirm) {
      showMessage("Vui lòng điền đầy đủ thông tin.", "error", message); // Pass message element
      return;
    }
    if (password.length < 6) {
      showMessage("Mật khẩu phải từ 6 ký tự.", "error", message); // Pass message element
      return;
    }
    if (password !== confirm) {
      showMessage("Mật khẩu nhập lại không khớp.", "error", message); // Pass message element
      return;
    }
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u) => u.email === email)) {
      showMessage("Email đã được đăng ký.", "error", message); // Pass message element
      return;
    }
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    showMessage("Đăng ký thành công! Bạn có thể đăng nhập.", "success", message); // Pass message element
    form.reset();
  });

  // Pass the message element to the showMessage function
  function showMessage(msg, type, messageElement) {
    if (messageElement) {
      messageElement.textContent = msg;
      messageElement.style.color = type === "success" ? "#4caf50" : "#e53935";
    }
  }
});