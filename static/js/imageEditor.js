const filterMenu = document.querySelector("#filter-menu");

const filters = filterMenu.querySelectorAll("div");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const showMenuBtn = document.getElementById("show-menu-btn");
const image = document.querySelector("#image");

const saveImageBtn = document.getElementById("save-image-btn");

const img = new Image();
img.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;
  ctx.drawImage(img, 0, 0, this.width, this.height);
}
img.src = image.src;


filters.forEach((filter) => {
  filter.addEventListener("click", function(e){
    const filterCode = this.parnent.getAttribute("data-filter");
    image.style.filter = filterCode;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filterCode;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }.bind({parnent: filter}));
});

showMenuBtn.addEventListener("click", () => {
  console.log(filterMenu);
  if (filterMenu.style.transform == "unset")
    filterMenu.style.transform = "translateX(90vw)";
  else filterMenu.style.transform = "unset";
});

saveImageBtn.addEventListener("click", () => {
canvas.toBlob(function(blob) {
  const formData = new FormData();
  formData.append('new-image', blob, 'filename.png');
  formData.append('image-name', image.src.split('inspect/').pop());

  fetch('/api/save-image', {
    method: 'POST',
    body: formData
  })
});

})