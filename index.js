var textArea = document.getElementById('results')

function writeLine(x)
{
  textArea.textContent = textArea.textContent + x + '\n'
}

function add(a, b) {
  return a + b; 
}

function subtract(x, y) {
  return x - y;
}

function divide(x, y) {
  if (y == 0) {
    return null;
  }
  return x / y;
}

var curriedAdd = curry(add)
var curriedDivide = curry(divide)
var divideBy = curry(function (x, y)  {
  if (x == 0) {
    return null;
  }
  return y / x  
});

var addTo4 = curriedAdd(4)
var add11 = compose(addTo4, curriedAdd(7))

var simpleAdd = Maybe.fromNullable(add11(42))
var simpleDivide = Maybe.fromNullable(curriedDivide(42)(6))
var badDivide = Maybe.fromNullable(curriedDivide(42)(0))

textArea.textContent = ''

var someMath = compose(add11, add11)(13)
writeLine('compose(add11, add11)(13): ' + someMath)

var moreMath = compose(map(divideBy(0)), map(add11))(simpleAdd)
writeLine('compose(map(divideBy(0)), map(add11))(simpleAdd): ' + moreMath)

function someNotCurriedFunc(x) {
  return x + 200
}

var composition = compose(map(someNotCurriedFunc), map(add11))(Maybe.fromNullable(42))
writeLine("composition: " + composition)

writeLine("*** now let's make bad stuff happen ***");
simpleAdd.map(writeLine)
simpleDivide.map(writeLine)
badDivide.map(writeLine)

// or
//chain(writeLine)(simpleDivide)
//chain(writeLine)(badDivide)

writeLine("*** and the flowers are still standing ***");