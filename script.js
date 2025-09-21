
let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
function renderMessages() {  const chatBox = document.getElementById("chat-box");  chatBox.innerHTML = "";  history.forEach(m => {    const div = document.createElement("div");    div.className = `message ${m.role}`;    div.textContent = m.role === "user" ? `شما: ${m.content}` : `روانشناس: ${m.content}`;    chatBox.appendChild(div);  });  chatBox.scrollTop = chatBox.scrollHeight;}
async function sendMessage() {  const msg = document.getElementById("msg").value.trim();  if (!msg) return;
  history.push({ role: "user", content: msg });  renderMessages();  document.getElementById("msg").value = "";
  const chatBox = document.getElementById("chat-box");  const typing = document.createElement("div");  typing.className = "message bot";  typing.textContent = "روانشناس در حال نوشتن...";  chatBox.appendChild(typing);
  try {    const res = await fetch("/chat", {      method: "POST",      headers: { "Content-Type": "application/json" },      body: JSON.stringify({ message: msg, history })    });    const data = await res.json();
    history.push({ role: "bot", content: data.reply });    localStorage.setItem("chatHistory", JSON.stringify(history));    renderMessages();  } catch (err) {    history.push({ role: "bot", content: "⚠️ خطا در ارتباط با سرور." });    renderMessages();  }}
renderMessages();
