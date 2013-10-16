
computeNextPrice = function(product, paid){
  var ans = product.initialPrice;
  var numCopies = (product.fundRaised + paid) / product.initialPrice;
  if (numCopies != 0){
    var donationsNeeded = product.fundNeeded - product.donations; 
    if (donationsNeeded / numCopies < product.initialPrice)
      ans = Math.ceil(donationsNeeded / numCopies);
  }
  console.log('next is ', ans)
  return ans
}

computeFairPrice = function(product, paid){
  var ans = product.initialPrice;
  var numCopies = (product.fundRaised + paid) / product.initialPrice;
  if (numCopies != 0){
    var donationsNeeded = product.fundNeeded - product.donations; 
    if (donationsNeeded / numCopies < product.initialPrice)
      ans = Math.ceil(donationsNeeded / numCopies);
  }
  console.log('fair is ', ans)
  return ans
}