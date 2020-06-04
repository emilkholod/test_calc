function buttonClick(event) {
    var key = $(this).val();
    Calculator.clickedOn(key);
}

function handleKeyPressing(event) {
    var key = event.key;
    Calculator.clickedOn(key);

    if (key === "Backspace" || key === "Delete") {
        event.preventDefault();
        return false;
    }
}


$(document).ready(function() {
    Calculator.init();
    $(".btn").on('click', buttonClick);
    window.addEventListener("keydown", handleKeyPressing, true);
});
