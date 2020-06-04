const Digits = (function Digits() {
    return {
        name: "Digits",
        check: function(key) {
            var regexp = /^[0-9.]$/g;
            return regexp.test(key);
        }
    }
})();

const Consts = (function Consts() {
    var consts = ['pi', 'e'];
    return {
        name: "Consts",
        check: function(key) {
            return consts.indexOf(key) != -1;
        },
        pi: function() {
            return Math.PI;
        },
        e: function() {
            return Math.E;
        },
    }
})();

const BinaryOperators = (function BinaryOperators() {
    var operators = ['sum', 'minus', 'multiply', 'divide'];
    return {
        name: "BinaryOperators",
        check: function(key) {
            return operators.indexOf(key) != -1;
        },
        sum: function(x, y) {
            return x + y;
        },
        minus: function(x, y) {
            return x - y;
        },
        multiply: function(x, y) {
            return x * y;
        },
        divide: function(x, y) {
            return x / y;
        },
    }
})();

const UnaryOperators = (function() {
    var operators = ['sqrt', 'inverse_x', 'sin', 'cos', 'tg', 'ctg', 'arcsin', 'arccos', 'arctg', 'arcctg'];
    return {
        name: 'UnaryOperators',
        check: function(key) {
            return operators.indexOf(key) != -1;
        },
        sqrt: function(x) {
            return Math.sqrt(x);
        },
        inverse_x: function(x) {
            return 1 / x;
        },
        sin: function(x) {
            return Math.sin(x);
        },
        cos: function(x) {
            return Math.cos(x);
        },
        tg: function(x) {
            return Math.tan(x);
        },
        ctg: function(x) {
            return 1 / Math.tan(x);
        },
        arcsin: function(x) {
            return Math.asin(x);
        },
        arccos: function(x) {
            return Math.acos(x);
        },
        arctg: function(x) {
            return Math.atan(x);
        },
        arcctg: function(x) {
            return Math.PI / 2 - Math.atan(x);
        },
    }
})();

const Brackets = (function Brackets() {
    return {
        name: "Brackets",
        Open: {
            name: "OpenBracket",
            check: function(key) {
                return (key === '(')
            },
        },
        Close: {
            name: "CloseBracket",
            check: function(key) {
                return (key === ')')
            },
        },
    }
})();

const RulesAddingToExpression = (function() {
    function checkLastType(out, type) {
        return (out[out.length - 1].type == type)
    }
    return {
        canBeAddAsDigit: function(out, key) {
            var b = Digits.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && !checkLastType(out, Brackets.Close) && !checkLastType(out, Consts);
        },
        canBeAddAsUnaryOperator: function(out, key) {
            var b = UnaryOperators.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && !checkLastType(out, Digits) && !checkLastType(out, UnaryOperators) && !checkLastType(out, Brackets.Close);
        },
        canBeUsedAsUnaryOperator: function(out, key) {
            var b = UnaryOperators.check(key);
            if (out.length == 0) {
                return false;
            }
            return b && (checkLastType(out, Digits) || checkLastType(out, Consts));
        },
        canBeAddAsBinaryOperator: function(out, key) {
            var b = BinaryOperators.check(key);
            if (out.length == 0) {
                return false;
            }
            return b && !checkLastType(out, BinaryOperators) && !checkLastType(out, UnaryOperators) && !checkLastType(out, Brackets.Open);
        },
        canBeAddAsOpenBracket: function(out, key) {
            var b = Brackets.Open.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && !checkLastType(out, Digits) && !checkLastType(out, Consts);
        },
        canBeAddAsCloseBracket: function(out, key) {
            var b = Brackets.Close.check(key);
            if (out.length == 0) {
                return false;
            }
            return b && (checkLastType(out, Digits) || checkLastType(out, Brackets.Close) || checkLastType(out, Consts)) && Expression.getCurrentLevel() > 0;
        },
        canBeAddAsConst: function(out, key) {
            var b = Consts.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && !checkLastType(out, Digits) && !checkLastType(out, Brackets.Close) && !checkLastType(out, Consts);
        }
    }
})();

const Expression = (function() {
    var out;
    var arithLevel;
    var currArithLevel;

    function checkLastType(out, type) {
        return (out[out.length - 1].type == type)
    }

    function add(type, value) {
        out.push({
            type: type,
            value: value
        });
    }

    function appendToPreviousNumber(key) {
        out[out.length - 1].value += key;
    }

    function removeIndex(array, index) {
        delete array[index];
        var new_array = array.filter(function(element) {
            return element != undefined
        });
        return new_array;
    }

    function removeEvaluatedInd(out, ind) {
        out = removeIndex(out, ind);
        out = removeIndex(out, ind);
        return out
    }

    function evaluateConsts(ind, curr_value) {
        while (arithLevel[ind] == curr_value) {
            if (Consts.check(out[ind].value)) {
                out[ind].value = out[ind].type[out[ind].value]();
                out[ind].type = Digits;
            }
            ind = ind + 1;
        }
    }

    function evaluateUnaryOperators(ind, curr_value) {
        while (arithLevel[ind] == curr_value) {
            if (UnaryOperators.check(out[ind].value)) {
                out[ind].value = out[ind].type[out[ind].value](parseFloat(out[ind + 1].value));
                out[ind].type = Digits;
                out = removeIndex(out, ind + 1);
                arithLevel = removeIndex(arithLevel, ind + 1);
                ind = ind - 1;
            }
            ind = ind + 1;
        }
    }

    function evaluateBinaryOperators(ind, curr_value, arr_of_operators_names) {
        while (arithLevel[ind] == curr_value) {
            if (arr_of_operators_names.indexOf(out[ind].value) != -1) {
                out[ind - 1].value = out[ind].type[out[ind].value](parseFloat(out[ind - 1].value), parseFloat(out[ind + 1].value));
                out = removeEvaluatedInd(out, ind);
                arithLevel = removeEvaluatedInd(arithLevel, ind);
                ind = ind - 2;
            }
            ind = ind + 1;
        }
    }

    function replaceBracketsToOrder() {
        var out2 = [];
        var arithLevel2 = [];
        var currArithLevel2 = 0;
        for (var i = 0; i < out.length; i++) {
            if (out[i].type != Brackets.Open && out[i].type != Brackets.Close) {
                out2.push(out[i]);
                arithLevel2.push(currArithLevel2);
            } else {
                if (out[i].value == '(') {
                    currArithLevel2 = currArithLevel2 + 1
                } else if (out[i].value == ')') {
                    currArithLevel2 = currArithLevel2 - 1
                }
            }
        }
        out = out2;
        arithLevel = arithLevel2;
    }

    function inverseTranslateSymbol(key) {
        switch (key) {
            case 'sum':
                return '+';
            case 'minus':
                return '-';
            case 'multiply':
                return '*';
            case 'divide':
                return '/';
            case 'sqrt':
                return '√';
            case 'inverse_x':
                return '1/';
            case 'pi':
                return 'π';
            case 'OpenBracket':
                return '(';
            case 'CloseBracket':
                return ')';
            default:
                return key;
        }
    }

    function filterView(val_in) {
        var res = val_in;
        if (Math.abs(val_in) < 1e-14) {
            res = '0';
        } else if (Math.abs(val_in) >= 16331239353195370) {
            res = 'Infinity';
        } else if (val_in <= -8165619676597685) {
            res = '-Infinity';
        }
        return res;
    }


    return {
        init: function() {
            out = [];
            arithLevel = [];
            currArithLevel = 0;
        },
        append: function(key) {
            var was_key_added = true;
            if (RulesAddingToExpression.canBeAddAsDigit(out, key)) {
                if ((out.length == 0) || (out[out.length - 1].type != Digits)) {
                    add(Digits, key);
                } else if (out[out.length - 1].type == Digits) {
                    if (key != '.' || (key === '.' && out[out.length - 1].value.indexOf('.') == -1)) {
                        appendToPreviousNumber(key);
                    } else {
                        console.log('Запятая уже поставлена', key);
                        was_key_added = false;
                    }
                }
            } else if (RulesAddingToExpression.canBeAddAsBinaryOperator(out, key)) {
                add(BinaryOperators, key);
            } else if (RulesAddingToExpression.canBeAddAsOpenBracket(out, key)) {
                currArithLevel = currArithLevel + 1;
                add(Brackets.Open, '(');
            } else if (RulesAddingToExpression.canBeAddAsCloseBracket(out, key)) {
                add(Brackets.Close, ')');
                currArithLevel = currArithLevel - 1;
            } else if (RulesAddingToExpression.canBeUsedAsUnaryOperator(out, key)) {
                var lastObj = out.pop();
                add(UnaryOperators, key);
                currArithLevel = currArithLevel + 1;
                add(Brackets.Open, '(');
                add(lastObj.type, lastObj.value);
                add(Brackets.Close, ')');
                currArithLevel = currArithLevel - 1;
            } else if (RulesAddingToExpression.canBeAddAsUnaryOperator(out, key)) {
                add(UnaryOperators, key);
            } else if (RulesAddingToExpression.canBeAddAsConst(out, key)) {
                add(Consts, key);
            } else {
                console.log('Символ не подходит по правилам', key);
                was_key_added = false;
            }
            return was_key_added;
        },
        getCurrentLevel: function() {
            return currArithLevel;
        },
        getExpression: function() {
            return out;
        },
        canBeEvaluate: function() {
            if (out.length == 0) {
                return true;
            }
            return (checkLastType(out, Digits) || checkLastType(out, Brackets.Close) || checkLastType(out, Consts));
        },
        evaluate: function() {
            replaceBracketsToOrder();
            var max_level = Math.max.apply(Math, arithLevel);
            while (true) {
                var curr_ind = arithLevel.indexOf(max_level);
                var curr_value = arithLevel[curr_ind];
                var ind = curr_ind;
                var isLevelConsistsOfOneNumber = (curr_value != arithLevel[curr_ind + 1]);
                if (isLevelConsistsOfOneNumber) {
                    evaluateConsts(curr_ind, curr_value);
                    arithLevel[curr_ind] = curr_value - 1;
                } else if (out.length > 0) {
                    evaluateConsts(curr_ind, curr_value);
                    evaluateUnaryOperators(curr_ind, curr_value);
                    evaluateBinaryOperators(curr_ind, curr_value, ['multiply', 'divide']);
                    evaluateBinaryOperators(curr_ind, curr_value, ['sum', 'minus']);
                }
                max_level = Math.max.apply(Math, arithLevel);
                if (out.length <= 1) {
                    break;
                }
            }
            var res = 0;
            if (out.length > 0) {
                out[0].value = filterView(out[0].value)
                out[0].value = (parseFloat(out[0].value)).toString();
                res = out[0].value
            }
            currArithLevel = 0;
            return res;
        },
        remove: function() {
            var lastObj = out[out.length - 1]
            if (lastObj.type == Digits) {
                out[out.length - 1].value = lastObj.value.slice(0, lastObj.value.length - 1);
                if (out[out.length - 1].value.length == 0) {
                    out = out.slice(0, out.length - 1);
                    arithLevel = arithLevel.slice(0, arithLevel.length - 1);
                }
            } else if ([UnaryOperators, BinaryOperators, Brackets.Open, Brackets.Close, Consts].indexOf(lastObj.type) != -1) {
                out = out.slice(0, out.length - 1);
                arithLevel = arithLevel.slice(0, arithLevel.length - 1);
            }
        },
        render: function() {
            var res = ''
            for (var i = 0, l = out.length; i < l; i++) {
                res += inverseTranslateSymbol(out[i].value);
            }
            return res;
        }
    }
})();
