(() => {
  // dropdown user: myprofile + logout
  document
    .querySelector(".navbar .icon-user")
    .addEventListener("mouseenter", () => {
      document
        .querySelector(".user-dropdown")
        .classList.remove("user-dropdown-hidden");
    });

  document
    .querySelector(".navbar .icon-user")
    .addEventListener("mouseleave", () => {
      document
        .querySelector(".user-dropdown")
        .classList.add("user-dropdown-hidden");
    });

  // modal myprofile
  document.getElementById("myprofile").addEventListener("click", () => {
    document
      .querySelector(".modal-myprofile")
      .classList.remove("modal-myprofile-hidden");
  });

  document.getElementById("annulateMyprofile").addEventListener("click", () => {
    document
      .querySelector(".modal-myprofile")
      .classList.add("modal-myprofile-hidden");
    [...document.querySelectorAll(".modal-myprofile input")].forEach(
      (input) => {
        input.disabled = true;
        input.value = input.getAttribute('default-value');
        input.style.opacity = 0.5;
      }
    );
  });

  // for icon edit, myprofile modal
  document.querySelectorAll(".fa-pen-to-square").forEach((el) => {
    el.addEventListener("click", () => {
      const idInput = el.id.substring(el.id.indexOf("-") + 1, el.id.length);
      let inputs = [...document.querySelectorAll(`#${idInput}`)];
      inputs.forEach((input) => {
        input.disabled === true
          ? ((input.disabled = false), (input.style.opacity = 1))
          : ((input.disabled = true), (input.style.opacity = 0.5));
      });
    });
  });
})();
