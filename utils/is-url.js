function isURL(string){
    try {
        new URL(string);
        return true;
    } catch(error) {
        return false;
    }
}

module.exports = isURL