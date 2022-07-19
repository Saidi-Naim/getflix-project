(() => {
  document
    .querySelector(".navbar .dropdown")
    .addEventListener("mouseenter", () => {
      document.querySelector(".sub_menu").style.height = "calc(100vh - 100px)";
      [...document.querySelectorAll(".sub_menu li")].forEach((li) => {
        li.classList.remove("sub_menu_li_hidden");
      });
    });

  document
    .querySelector(".navbar .dropdown")
    .addEventListener("mouseleave", () => {
      document.querySelector(".sub_menu").style.height = "0";
      [...document.querySelectorAll(".sub_menu li")].forEach((li) => {
        li.classList.add("sub_menu_li_hidden");
      });
    });
})();
