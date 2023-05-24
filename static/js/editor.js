const textarea = document.getElementById("text-edit")
const numbers = document.getElementById("numbers")


window.onload = () => {
    numbers.innerHTML = "";

    textarea.value.split("\n").forEach((line, i) => {
        numbers.innerHTML += `<p>${i + 1}</p>`
    })

    textarea.rows = textarea.value.split("\n").length + 1
}

textarea.addEventListener("keyup", (e) => {
    numbers.innerHTML = "";

    textarea.value.split("\n").forEach((line, i) => {
        numbers.innerHTML += `<p>${i + 1}</p>`
    })

    textarea.rows = textarea.value.split("\n").length + 1
})
