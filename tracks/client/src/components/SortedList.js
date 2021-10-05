import React from 'react';

// Compare function needed by the Sort component
const compare =(a, b) => {
    // you can access the relevant property like this a.props[by]
// depending whether you are sorting by tilte or year, you can write a compare function here, 
    return (a.props.votes < b.props.votes);
  }

const SortedList= ({children, by})=> {
  if (!by) {
    // If no 'sort by property' provided, return original list
   return children
  }
  return React.Children.toArray(children).sort(compare)
}

export default SortedList;