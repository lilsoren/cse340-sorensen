const form = document.querySelector("#changePassword")
    form.addEventListener("input", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })