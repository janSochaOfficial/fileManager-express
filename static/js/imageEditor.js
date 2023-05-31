const filterMenu = document.querySelector("#filter-menu");

const filters = filterMenu.querySelectorAll("div");
const canvas = document.querySelector("#canvas");

const showMenuBtn = document.getElementById("show-menu-btn");
const image = document.querySelector("#image");


filters.forEach((filter) => {
  filter.addEventListener("click", function(e){
    const filterCode = this.parnent.getAttribute("data-filter");
    image.style.filter = filterCode;
  }.bind({parnent: filter}));
});

showMenuBtn.addEventListener("click", () => {
  console.log(filterMenu);
  if (filterMenu.style.transform == "unset")
    filterMenu.style.transform = "translateX(90vw)";
  else filterMenu.style.transform = "unset";
});
