const Calculator = (function() {
    var id = 'expression_viewer';

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

    function inverseTranslateSymbol(key) {
        switch (key) {
            case 'sqrt':
                return '√';
            case 'inverse_x':
                return '1/';
            default:
                return key;
        }
    }

    return {
        init: function() {
            Expression.init();
        },
        update: function(key_in) {
            var key = translateSymbol(key_in)
            if (key === '=' || key == 'Enter') {
                var canBeEvaluate = Expression.canBeEvaluate()
                if (canBeEvaluate) {
                    document.getElementById(id).value = Expression.evaluate();
                    highlightViewer('highlight-evaluted', 500);
                } else {
                    highlightViewer('highlight-error', 250);
                }
            } else if (key === 'clear' || key == 'Escape') {
                Expression.init();
                document.getElementById(id).value = '';
            } else if (key === 'remove' || key == 'Backspace') {
                Expression.remove();
                var len = document.getElementById(id).value.length;
                document.getElementById(id).value = document.getElementById(id).value.slice(0, len - 1);
            } else {
                var was_key_added = Expression.add(key);
                if (was_key_added) {
                    key_in = inverseTranslateSymbol(key_in)
                    document.getElementById(id).value = document.getElementById(id).value+(key_in).toString();

                    var elem = document.getElementById(id);
                    elem.scrollLeft = elem.scrollWidth;

                    highlightViewer('highlight-correct-input', 250);

                } else {
                    console.log('Символ ', key, ' не добавлен в выражение');
                    highlightViewer('highlight-error', 250);
                }
            }
        },
    }
})();
Calculator.init();
