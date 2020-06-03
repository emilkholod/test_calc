const Calculator = (function() {
    var id = 'expression_viewer';
    var is_active_inverse_trig = false;


    function highlightViewer(cls, timeout) {
        $('#expression_viewer').addClass(cls);
        setTimeout(function() {
            $('#expression_viewer').removeClass(cls);
        }, timeout);
    }

    function translateSymbol(key) {
        switch (key) {
            case 'Add':
            case '+':
                return 'sum';
            case 'Subtract':
            case '-':
                return 'minus';
            case 'Multiply':
            case '*':
                return 'multiply';
            case 'Divide':
            case '/':
                return 'divide';
            case 'Decimal':
                return '.';
            case 'Esc':
                return 'Escape';
            default:
                return key;
        }
    }



    function hideTrigElements(trig) {
        for (var i = 0, l = trig.length; i < l; i++) {
            trig[i].style.display = "none";
        }
    }

    function showTrigElements(trig) {
        for (var i = 0, l = trig.length; i < l; i++) {
            trig[i].style.display = "block";
            trig[i].style.marginTop = "0px !important";
        }
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function saveToHistory(expression) {
        var frag = document.createDocumentFragment(), el = document.createElement("div");
        frag.appendChild(el);
        frag.childNodes[0].className = 'row';
        var div = document.getElementById("history");
        div.insertBefore(el, div.firstChild);
        var frag2 = document.createDocumentFragment(), el2 = document.createElement("input");
        frag.appendChild(el2);
        frag.childNodes[0].value = expression
        frag.childNodes[0].type = "text"
        frag.childNodes[0].readOnly = "readonly"
        frag.childNodes[0].className = "form-control"
        el.appendChild(el2)
    }

    return {
        init: function() {
            Expression.init();
        },
        updateExpressionViewer: function(key_in) {
            var key = translateSymbol(key_in)
            if (key === '=' || key == 'Enter') {
                var canBeEvaluate = Expression.canBeEvaluate();
                if (canBeEvaluate) {
                    var expression_to_save=document.getElementById(id).value;
                    var evaluted = Expression.evaluate();
                    expression_to_save+=' = '+ evaluted;
                    document.getElementById(id).value = evaluted;
                    highlightViewer('highlight-evaluted', 500);
                    saveToHistory(expression_to_save);
                } else {
                    highlightViewer('highlight-error', 250);
                }
            } else if (key === 'clear' || key == 'Escape') {
                Expression.init();
                document.getElementById(id).value = '';
                highlightViewer('highlight-correct-input', 250);
            } else if (key === 'remove' || key == 'Backspace') {
                Expression.remove();
                document.getElementById(id).value = Expression.render();
                highlightViewer('highlight-correct-input', 250);
            } else {
                var was_key_added = Expression.add(key);
                if (was_key_added) {
                    document.getElementById(id).value = Expression.render();

                    var elem = document.getElementById(id);
                    elem.scrollLeft = elem.scrollWidth;

                    highlightViewer('highlight-correct-input', 250);
                } else {
                    console.log('Символ ', key, ' не добавлен в выражение');
                    highlightViewer('highlight-error', 250);
                }
            }
        },
        inverseTrigFunctions: function() {
            var trig = document.getElementsByClassName("trig");
            var inversed = document.getElementsByClassName("inverse_trig");
            if (is_active_inverse_trig) {
                hideTrigElements(inversed)
                showTrigElements(trig)
            } else {
                hideTrigElements(trig)
                showTrigElements(inversed)
            }
            is_active_inverse_trig = !is_active_inverse_trig;
        },
        saveToHistory2: saveToHistory,
    }
})();
Calculator.init();
