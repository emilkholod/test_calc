$(".btn").on("click", function(event) {
    var key = $(this).val();
    if (key === 'Inv') {
        Calculator.inverseTrigFunctions();
    } else {
        Calculator.updateExpressionViewer(key);
    }
});

function handleKeyPressing(event) {
    var key = event.key;
    Calculator.updateExpressionViewer(key);

    if (key === "Backspace" || key === "Delete") {
        event.preventDefault();
        return false;
    }
}
window.addEventListener("keydown", handleKeyPressing, true);
