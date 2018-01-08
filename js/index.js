// Catch enter keypress on manual input
function key(e) {
  if(e.keyCode === 13) {
    calculate();
  }
}

// Take the input and calculate the result
function calculate() {
  let input = document.getElementById("input").value;
  // Leave only numbers and math operators
  input = input.replace(/([^0-9.+*\-/])/g, "");
  // Replace -- with + to reflect calculator behavior
  input = input.replace(/(--)+/g,"+");
  // Split on digits – be sure to catch negatives and decimals
  let operations = input.split(/([-]\d*\.?\d+)|(\d*\.?\d+)/g);
  // Make sure empty strings and undefined are filtered out
  operations = operations.filter((val) => {
    if(val == "" || !val) {
      return false;
    } else {
      return true;
    }
  });
  
  // Helper function to do computations on the two items
  function compute(operation, a, b) {
    switch (operation) {
      case "*":
        return a*b;
        break;
      case "/":
        return a/b;
        break;
      case "-":
        return a-b;
        break;
      case "+":
        return a+b;
        break;
    }
  }
  
  // Function that takes the array, and computes the results for all operations
  function subCalc(arr, operation) {
    // Copy the array
    let temp = [...arr];
    if(temp.length > 2) {
      // As long as the current operation (eg *) is still in the array
      while(temp.indexOf(operation) > 0) {
        let index = temp.indexOf(operation);
          temp.splice(
            index - 1, 
            3, 
            compute(
              operation,
              parseFloat(temp[index-1]), 
              parseFloat(temp[index+1])
            )
          );
      }
    } else {
      // If we're left with length > 1 on the minus operator, we're dealing with arrays like [3,-3] (with no seperate operator). We can parse it as a sum (3-3 == 3+-3 == 0);
      while(temp.length > 1 && operation == "-") {
        temp.splice(0,2,compute("+", parseFloat(temp[0]), parseFloat(temp[1])));
      }
    }
    return temp;
  }
   // Do stuff in the right order
   // operations = negNumbers(operations);
   operations = subCalc(operations, "*");
   operations = subCalc(operations, "/");
   operations = subCalc(operations, "+");
   operations = subCalc(operations, "-");
   if(isNaN(operations[0])) {
     operations[0] = 0;
   }
  // Write the result to the right input and truncate at 10 chars
  document.getElementById("input").value = operations[0].toString().substring(0,10);
  
};
document.querySelectorAll(".calc").forEach((val) => {
  val.onclick = function() {
    document.getElementById("input").value = `${document.getElementById("input").value}${val.dataset.val}`
  }
});
document.getElementById("ac").onclick = function() {
  document.getElementById("input").value = "";
};
document.getElementById("ce").onclick = function() {
  let val = document.getElementById("input").value;
  val = val.replace(/([^0-9.+*\-/])/g, "");
  val = val.split(/([+]|[-]|[*]|[/])/g).filter((val) => val);
  val.pop();
  document.getElementById("input").value = val.join("");
};
document.getElementById("percent").onclick = function() {
  let val = document.getElementById("input").value;
  val = val.replace(/([^0-9.+*\-/])/g, "");
  val = val.split(/([+]|[-]|[*]|[/])/g).filter((val) => val);
  val[val.length-1] = parseInt(val[val.length-1]) / 100;
  document.getElementById("input").value = val.join("");
};
document.getElementById("equals").onclick = calculate;