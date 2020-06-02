function buttonClick(event) {
    var key = $(this).val();
    if (key === 'Inv') {
        Calculator.inverseTrigFunctions();
    } else {
        Calculator.updateExpressionViewer(key);
    }
}

var elements = document.getElementsByClassName("btn");
for (var i = 0; i < elements.length; i++) {
    if (elements[i].addEventListener) {
        elements[i].addEventListener('click', buttonClick, true);
    } else if (elements[i].attachEvent) {
        elements[i].attachEvent('onclick', buttonClick);
    }
}

function handleKeyPressing(event) {
    var key = event.key;
    Calculator.updateExpressionViewer(key);

    if (key === "Backspace" || key === "Delete") {
        event.preventDefault();
        return false;
    }
}
window.addEventListener("keydown", handleKeyPressing, true);

// $("carouselMain").carousel({
//   swipe: 50 // percent-per-second, default is 50. Pass false to disable swipe
// });
