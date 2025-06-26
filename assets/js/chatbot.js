// assets/js/chatbot.js

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("chatbot-btn");
  const windowEl = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("chatbot-close");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  btn.addEventListener("click", () => {
    windowEl.style.display = "flex";
    input.focus();
  });
  closeBtn.addEventListener("click", () => {
    windowEl.style.display = "none";
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    setTimeout(() => {
      addMessage(getBotReply(text), "bot");
    }, 600);
  });

  function addMessage(msg, type) {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.margin = "6px 0";
    div.style.padding = "7px 12px";
    div.style.borderRadius = "14px";
    div.style.maxWidth = "80%";
    if (type === "user") {
      div.style.background = "#e3f2fd";
      div.style.alignSelf = "flex-end";
      div.style.marginLeft = "auto";
    } else {
      div.style.background = "#fffde7";
      div.style.alignSelf = "flex-start";
      div.style.marginRight = "auto";
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function getBotReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("giá")) return "Bạn muốn hỏi giá sản phẩm nào?";
    if (lower.includes("mua")) return "Bạn có thể đặt hàng trực tiếp trên web hoặc gọi hotline!";
    if (lower.includes("bảo hành")) return "Sản phẩm được bảo hành chính hãng từ 12-36 tháng.";
    if (lower.includes("giao hàng")) return "Chúng tôi giao hàng toàn quốc, nhanh chóng và an toàn.";
    if (lower.includes("xin chào") || lower.includes("hello")) return "Xin chào! Tôi có thể giúp gì cho bạn?";
    return "Cảm ơn bạn đã liên hệ! Bộ phận CSKH sẽ phản hồi sớm nhất.";
  }
});