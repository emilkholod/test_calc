const Calculator = (function() {
    var id = 'expression_viewer';

    return {
        init: function() {
            Expression.init();
        },
        update: function(key) {
            if (key === '=' || key=='Enter') {
                document.getElementById(id).value=Expression.evaluate();
            } else if (key === 'clear' || key == 'Escape') {
                Expression.init();
                document.getElementById(id).value='';
            } else if (key === 'remove' || key=='Backspace') {
                Expression.remove();
                var len=document.getElementById(id).value.length;
                document.getElementById(id).value=document.getElementById(id).value.slice(0,len-1);
            } else {
                var was_key_added = Expression.add(key);
                if (was_key_added) {
                    document.getElementById(id).value += (key).toString();

                    var elem = document.getElementById(id);
                    elem.focus();
                    elem.scrollLeft = elem.scrollWidth;

                } else {
                    console.log('Символ ', key, ' не добавлен в выражение');
                }
            }
        },
    }
})();
Calculator.init();
