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
            case '+':
                return 'sum';
            case '-':
                return 'minus';
            case '*':
                return 'multiply';
            case '/':
                return 'divide';
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
        var el = document.createElement("div");
        el.className = 'row'
        var div = document.getElementById("history");
        div.append(el)
        var el2 = document.createElement("input");
        el2.value = expression
        el2.type = "text"
        el2.readOnly = "readonly"
        el2.className = "form-control"
        el.append(el2)
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
                    saveToHistory(expression_to_save);
                    document.getElementById(id).value = evaluted;
                    highlightViewer('highlight-evaluted', 500);
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
                    // key_in = inverseTranslateSymbol(key_in)
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
    }
})();
Calculator.init();
