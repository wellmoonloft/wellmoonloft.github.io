let catalog = document.getElementById("catalog");
let catalogTopHeight = catalog.offsetTop;
let tocElement = document.getElementsByClassName("catalog-content")[0]
function changePos() {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > catalogTopHeight - 20) {
    catalog.style = "position: fixed; top: 20px; bottom: 20px;"
  } else {
    catalog.style = "position: absolute; top: calc(290px + 88px + 30px)"
  }
}
function isActiveCat() {
  let offsetHeight = 20
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let headerLinkList = document.getElementsByClassName("headerlink")
  let catLinkList = document.getElementsByClassName("toc-link")
  for(let i = 0; i < catLinkList.length; i++) {
    let currentTopCat = headerLinkList[i].offsetTop - offsetHeight
    let nextTopCat = i + 1 === headerLinkList.length ?
        Infinity : headerLinkList[i+1].offsetTop - offsetHeight
    if (scrollTop >= currentTopCat && scrollTop < nextTopCat) {
      catLinkList[i].className = "toc-link active"
      tocElement.scrollTop = catLinkList[i].offsetTop - 32
    } else {
      catLinkList[i].className = "toc-link"
    }
  }
}
function handleResize() {
  let windowHeight = document.documentElement.clientHeight
  tocElement.setAttribute('style', `height: ${windowHeight - 90}px`);
}
changePos();
isActiveCat();
handleResize();
document.addEventListener("scroll", changePos, false);
document.addEventListener("scroll", isActiveCat, false);
window.addEventListener("resize", handleResize, false);