function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
