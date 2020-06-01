"use strict";

const Digits = (function Digits() {
    return {
        name: "Digits",
        check: function(key) {
            var regexp = /[0-9]/g;
            return regexp.test(key);
        }
    }
})();

const BinaryOperators = (function BinaryOperators() {
    var operators = ['+', '-', '*', '/'];
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
    var operators = ['sqrt'];
    return {
        name: 'UnaryOperators',
        check: function(key) {
            return operators.indexOf(key) != -1;
        },
        sqrt: function(x) {
            return x ** 0.5;
        }
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
            return Digits.check(key);
        },
        canBeAddAsUnaryOperator: function(out, key) {
            var b = UnaryOperators.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && !checkLastType(out, Digits) && !checkLastType(out, UnaryOperators);
        },
        canBeUsedAsUnaryOperator: function(out, key) {
            var b = UnaryOperators.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && checkLastType(out, Digits);
        },
        canBeAddAsBinaryOperator: function(out, key) {
            var b = BinaryOperators.check(key);
            if (out.length == 0) {
                return false;
            }
            return BinaryOperators.check(key) && !checkLastType(out, BinaryOperators) && !checkLastType(out, UnaryOperators);
        },
        canBeAddAsOpenBracket: function(out, key) {
            var b = Brackets.Open.check(key);
            if (out.length == 0) {
                return b;
            }
            return b && !checkLastType(out, Digits);
        },
        canBeAddAsCloseBracket: function(out, key) {
            var b = Brackets.Close.check(key);
            if (out.length == 0) {
                return false;
            }
            return b && (checkLastType(out, Digits) || checkLastType(out, Brackets)) && Expression.getCurrentLevel() > 0;
        },
    }
})();

const Expression = (function() {
    var out;
    var arithLevel;
    var currArithLevel;

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

    function evaluateUnaryOperators(ind, curr_value, arr_of_operators_names) {
        while (arithLevel[ind] == curr_value) {
            if (arr_of_operators_names.indexOf(out[ind].value.name) != -1) {
                out[ind].value = out[ind].value(parseFloat(out[ind + 1].value));
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
            if (arr_of_operators_names.indexOf(out[ind].value.name) != -1) {
                out[ind - 1].value = out[ind].value(parseFloat(out[ind - 1].value), parseFloat(out[ind + 1].value));
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
            if (out[i].type != Brackets) {
                out2.push(out[i]);
                arithLevel2.push(currArithLevel2);
            } else {
                if (out[i].value == Brackets.Open) {
                    currArithLevel2 = currArithLevel2 + 1
                } else if (out[i].value == Brackets.Close) {
                    currArithLevel2 = currArithLevel2 - 1
                }
            }
        }
        out = out2;
        arithLevel = arithLevel2;
    }


    return {
        init: function() {
            out = [];
            arithLevel = [];
            currArithLevel = 0;
        },
        add: function(key) {
            var was_key_added=true;
            if (RulesAddingToExpression.canBeAddAsDigit(out, key)) {
                if ((out.length == 0) || (out[out.length - 1].type != Digits)) {
                    add(Digits, key);
                } else if (out[out.length - 1].type == Digits) {
                    appendToPreviousNumber(key);
                }
            } else if (RulesAddingToExpression.canBeAddAsBinaryOperator(out, key)) {
                switch (key) {
                    case '+':
                        add(BinaryOperators, BinaryOperators.sum);
                        break;
                    case '-':
                        add(BinaryOperators, BinaryOperators.minus);
                        break;
                    case '*':
                        add(BinaryOperators, BinaryOperators.multiply);
                        break;
                    case '/':
                        add(BinaryOperators, BinaryOperators.divide);
                        break;
                    default:
                        console.log('Бинарная операция не найдена!');
                        was_key_added=false;
                }
            } else if (RulesAddingToExpression.canBeAddAsOpenBracket(out, key)) {
                currArithLevel = currArithLevel + 1;
                add(Brackets, Brackets.Open);
            } else if (RulesAddingToExpression.canBeAddAsCloseBracket(out, key)) {
                add(Brackets, Brackets.Close);
                currArithLevel = currArithLevel - 1;
            } else if (RulesAddingToExpression.canBeAddAsUnaryOperator(out, key)) {
                switch (key) {
                    case 'sqrt':
                        add(UnaryOperators, UnaryOperators.sqrt);
                        break;
                    default:
                        console.log('Унарная операция не найдена!');
                        was_key_added=false;
                }
            } else if (RulesAddingToExpression.canBeUsedAsUnaryOperator(out, key)) {
                switch (key) {
                    case 'sqrt':
                        var ind = out.length - 1;
                        out[ind].value = UnaryOperators[key](parseFloat(out[ind].value));
                        break;
                    default:
                        console.log('Унарная операция не найдена!');
                        was_key_added=false;
                }
            } else {
                console.log('Символ не подходит по правилам', key);
                was_key_added=false;
            }
            return was_key_added;
        },
        getCurrentLevel: function() {
            return currArithLevel;
        },
        getExpression: function() {
            return out;
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
                    arithLevel[curr_ind] = curr_value - 1;
                } else if (out.length > 0) {
                    evaluateUnaryOperators(curr_ind, curr_value, [UnaryOperators.sqrt.name]);
                    evaluateBinaryOperators(curr_ind, curr_value, [BinaryOperators.multiply.name, BinaryOperators.divide.name]);
                    evaluateBinaryOperators(curr_ind, curr_value, [BinaryOperators.sum.name, BinaryOperators.minus.name]);
                }
                var max_level = Math.max.apply(Math, arithLevel);
                if (out.length == 1) {
                    break;
                }
            }
            out[0].value=(out[0].value).toString();
            return out[0].value;
        },
        remove: function() {
            var lastObj = out[out.length - 1]
            if (lastObj.type == Digits) {
                out[out.length - 1].value = lastObj.value.slice(0, lastObj.value.length - 1);
            } else if ([UnaryOperators, BinaryOperators, Brackets].indexOf(lastObj.type)) {
                out = out.slice(0, out.length - 1);
                arithLevel = arithLevel.slice(0, arithLevel.length - 1);
            }
        }
    }
})();
