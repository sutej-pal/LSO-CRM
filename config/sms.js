const msg91 = require("msg91")("secret", "ABCCRM", "4");


// Mobile No can be a single number, list or csv string

// msg91.send(mobileNo, "MESSAGE", function(err, response){
//     console.log(err);
//     console.log(response);
// });

module.exports = msg91;
