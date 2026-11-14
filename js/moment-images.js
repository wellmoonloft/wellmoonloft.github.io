(function () {
  var root = document.querySelector(".moments-list");
  if (!root) return;

  root.querySelectorAll(".moment-item .markdown-body img").forEach(function (img) {
    if (!img.getAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    if (!img.getAttribute("decoding")) {
      img.setAttribute("decoding", "async");
    }

    function applyOrientation() {
      var w = img.naturalWidth;
      var h = img.naturalHeight;
      if (!w || !h) return;
      img.classList.remove("moment-img--landscape", "moment-img--portrait");
      img.classList.add(h > w ? "moment-img--portrait" : "moment-img--landscape");
    }

    if (img.complete && img.naturalWidth) {
      applyOrientation();
    } else {
      img.addEventListener("load", applyOrientation, { once: true });
    }
  });
})();