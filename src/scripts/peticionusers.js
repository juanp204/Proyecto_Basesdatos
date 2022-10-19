
var peticion = (function() {
  
    function decodeHTMLEntities (str) {
        fetch(`http://localhost/user/${str}`)
        .then(result => result.json())
        .then((output) => {
            console.log(output)
            return output;
            
        }).catch(err => console.error(err));
    }
  
    return decodeHTMLEntities;
  })();