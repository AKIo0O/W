






require(__dirname+"/initdb.js");


var db = {
	file: "fsmodel",
	user: "usermodel"
};

// var getMethod = {
// 	3: "getById",
// 	4: "getByName",
// 	0: "",
// 	1: ""
// };

// var qs = require("querystring");

// var methods = {

// 	GET: function(req, res, pathname){
// 		var method = getMethod[pathname.length];

// 		if(method == "" || pathname.length == 0) return res.end("not found")

// 		pathname.push(callback);
// 		methods[method].apply(null, pathname);

// 		function callback(err, data){
// 			if(err || !data) res.end("error is "+err);
// 			else res.end(JSON.stringify(data));
// 		};

// 	},

// 	getById: function(a, b, c, callback){
// 		global[db[b]].findOne({_id:c}, callback);
// 	},

// 	getByName: function(a, b, c, d, callback){
// 		var data = {};
// 		data[c] = d;
// 		global[db[b]].findOne(data, callback);
// 	},

// 	// update 
// 	PUT: function(){

// 	},

// 	// new One
// 	POST: function(req, res, pathname){
// 		var dbname = pathname[1];
// 		var body = '';
// 		req.on("data",function(data){
// 			body += data;
// 		});
// 		req.on("end", function(){
// 			var post = qs.parse(body);
// 			var obj = new global[db[dbname]](post);
// 			console.log()
// 			obj.save(function(err, obj){
// 				if(err) res.end("save error");
// 				res.end(JSON.stringify(obj));
// 			});
// 		});
		
// 	}
// };


// var server = require("http").createServer(function (req, res) {
// 	res.writeHead(200, {"Access-Control-Allow-Origin":"*"});
// 	var pathname = require('url').parse(req.url, true).pathname.split("/");
// 	if(!db[pathname[1]]) return res.end("error table name");
// 	methods[req.method](req, res, pathname);
// });
// server.listen(8099,'127.0.0.1',function(){});

var userdao = global.usermodel;

var user = new userdao({
	phonenumber:18612290687,
	href:"www.baidu.com"
});
// user.save();

// userdao.find({},function(err, data){
// 	if(err) return console.log(err);
// 	console.log(data.toString())
// });


var http = require("http"),
	gumbo = require("gumbo-parser"),
	rex = /<a class=\'list.+?<\/a>/img,
	urls = [];


var hrefs = ["",
	"http://bj.ganji.com/fang1/a2m1/",
	"http://bj.ganji.com/fang1/a2o{i}m1/"
];

var i = 1;


var getNumber = function(url, callback){
	http.get(url,function(res){
		var string = "";
		res.on('data', function(chunk) {
	      	string += chunk.toString();
	    });
	    res.on("end",function(){
			callback(string);
	    });
	}).on("error", function(e){
		callback("error");
	});
};

var getIndex = function(url, next){

	getNumber(url, function(string){
		if(string == "error") next();
		var matches = string.match(rex);
		[].push.apply(urls, matches);
		next();
	})
};

var getPhone = function(url, next){
	getNumber(url, function(string){
		if(string == "error") next();
		var number = string.match(/<em class=\"contact-mobile\".+?<\/em>/img)[0].slice(-18,-5);
		var user = new userdao({
			phonenumber:number,
			href: url
		});

		user.save();
		next();
	});
};


var start = function(){

	var url = i == 1 ? hrefs[i] : hrefs[2].replace(/\{i\}/, i);
	getIndex(url, function(){
		i++;
		console.log("Index is processed NO."+i);
		if(i== 40) console.log("Indexe processing Finished");
		else start();
		if(i == 2) getPhoneNumber();
	});
};

var index = 0;

var getPhoneNumber = function(){
	var result = urls[index].match(/href=\'(.+?)\'/);
	if(result[1] == undefined){
		index++;
		getPhoneNumber();
	} else {
		console.log("Number is processed NO."+result[1]);
		getPhone("http://bj.ganji.com"+result[1], function(){
			index++;
			if(urls[index]== undefined) console.log("Number processing Finished");
			else getPhoneNumber();
		});
	}

};

console.log("start!");
start();
