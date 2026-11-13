(() => {
  const root = document.getElementById("language-switch");
  const trigger = document.getElementById("lang-trigger");
  const menu = document.getElementById("lang-menu");
  if (!root || !trigger || !menu) return;

  const close = () => {
    menu.classList.add("hidden");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    menu.classList.remove("hidden");
    trigger.setAttribute("aria-expanded", "true");
  };

  const toggle = () => {
    if (menu.classList.contains("hidden")) open();
    else close();
  };

  trigger.addEventListener("click", event => {
    event.stopPropagation();
    toggle();
  });

  document.addEventListener("click", event => {
    if (!root.contains(event.target)) close();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
})();
