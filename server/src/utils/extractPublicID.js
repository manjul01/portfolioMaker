

function reverseString(str) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

function extractIdentifierFromURL(url) {
    url = reverseString(url)
    let publicID = "";
    for(let i = 0; i<url.length; i++) {
        if(url[i] === '/') break;

        publicID += url[i];
    }

    
   
    let str = "";
    let i ;
    for( i = 0; i < publicID.length; i++) {
        
        if(publicID[i] === '.') break;
    }

    publicID.slice(i+1);
    let realID = "";
    for(let j = i + 1; j < publicID.length; j++) {
        realID += publicID[j];
    }
    realID = reverseString(realID)
     console.log(realID);
}

export { extractIdentifierFromURL };
