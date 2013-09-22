
var mongoose = require('mongoose');
mongoose.connect('mongodb://115.28.17.19:27017/test');


global.fsmodel = mongoose.model('file', mongoose.Schema({
    key: String,
    file: String
}));

global.usermodel = mongoose.model('users', mongoose.Schema({
    phonenumber: String,
    href:[],
    name: String
}));


