(() => {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const threshold = 280;

  const isScrollable = () => {
    const root = document.documentElement;
    return root.scrollHeight > root.clientHeight + 2;
  };

  const update = () => {
    const show = isScrollable() && window.scrollY > threshold;
    btn.classList.toggle("hidden", !show);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  document.addEventListener("DOMContentLoaded", update);
  update();
})();
