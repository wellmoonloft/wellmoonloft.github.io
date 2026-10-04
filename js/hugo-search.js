(() => {
  const input = document.getElementById("search-input");
  const overlay = document.getElementById("search-overlay");
  const results = document.getElementById("search-result");
  const open = document.getElementById("search-open");
  const close = document.getElementById("search-close");
  if (!input || !overlay || !results || !open || !close) return;
  let indexPromise;
  const show = () => { overlay.classList.remove("hidden"); input.focus(); };
  const hide = () => { overlay.classList.add("hidden"); input.value = ""; results.replaceChildren(); };
  open.addEventListener("click", show);
  close.addEventListener("click", hide);
  overlay.addEventListener("click", event => { if (event.target === overlay) hide(); });
  input.addEventListener("input", async () => {
    const query = input.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    if (!query) return;
    indexPromise ||= fetch(overlay.dataset.index).then(response => {
      if (!response.ok) throw new Error("Search index unavailable");
      return response.json();
    });
    try {
      const index = await indexPromise;
      const matches = index.filter(item => `${item.title} ${item.content}`.toLocaleLowerCase().includes(query)).slice(0, 30);
      const list = document.createElement("ul");
      list.className = "search-result-list";
      for (const item of matches) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.className = "search-result-title";
        link.href = item.url;
        link.textContent = item.title;
        li.append(link);
        const excerpt = document.createElement("p");
        excerpt.className = "search-result-abstract";
        excerpt.textContent = item.content.slice(0, 180);
        li.append(excerpt);
        list.append(li);
      }
      results.append(list);
    } catch (error) {
      results.textContent = "Search is temporarily unavailable.";
    }
  });
})();
