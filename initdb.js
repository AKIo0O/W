
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');


global.fsmodel = mongoose.model('file', mongoose.Schema({
    key: String,
    file: String
}));

global.usermodel = mongoose.model('user', mongoose.Schema({
    phonenumber: String,
    href:[]
}));


