
'use strict';
var crypto = require('crypto');
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') //convert to hexadecimal format
            .slice(0,length);   // return required number of characters 
};

var saltHashPasswordAlgo = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512 
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt : salt,
        passwordHash : value
    };
};

exports.encryptPW = function(userpassword) {
    var salt ="8bbde54840255d4c"; //Gives us salt of length 16
    var passwordData = saltHashPasswordAlgo(userpassword, salt);
    
    /*console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('\nSalt = '+passwordData.salt);*/
    
    return passwordData.passwordHash;
};
