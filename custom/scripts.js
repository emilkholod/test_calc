$(".btn").on("click", function(event) {
    var key = $(this).val();
    Calculator.update(key)
});

function handleKeyPressing(event) {
    var key = event.key;
    Calculator.update(key);

    if (key === "Backspace" || key === "Delete") {
        event.preventDefault();
        return false;
    }
}
window.addEventListener("keydown", handleKeyPressing, true);
