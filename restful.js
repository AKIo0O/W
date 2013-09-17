require(__dirname+"/initdb.js");



var db = {
	file: "fsmodel",
	user: "usermodel"
};

var getMethod = {
	3: "getById",
	4: "getByName",
	0: "",
	1: ""
};

var qs = require("querystring");

var methods = {

	GET: function(req, res, pathname){
		var method = getMethod[pathname.length];

		if(method == "" || pathname.length == 0) return res.end("not found")

		pathname.push(callback);
		methods[method].apply(null, pathname);

		function callback(err, data){
			if(err || !data) res.end("error is "+err);
			else res.end(JSON.stringify(data));
		};

	},

	getById: function(a, b, c, callback){
		global[db[b]].findOne({_id:c}, callback);
	},

	getByName: function(a, b, c, d, callback){
		var data = {};
		data[c] = d;
		global[db[b]].findOne(data, callback);
	},

	// update 
	PUT: function(){

	},

	// new One
	POST: function(req, res, pathname){
		var dbname = pathname[1];
		var body = '';
		req.on("data",function(data){
			body += data;
		});
		req.on("end", function(){
			var post = qs.parse(body),
				dao = global[db[dbname]];
			var obj = new dao(post);
			console.log(post.phonenumber)
			dao.findOne({phonenumber:post.phonenumber}).exec(function(err, data){

				if(err){
					obj.save(function(err, obj){
						if(err) res.end("save error");
						res.end(JSON.stringify(obj));
					});
				}else{
					data.href.push(post.href);
					data.save();
					res.end(JSON.stringify(data));
				}

			});
		});
		
	},

	SITE: function(req, res){
		var body = '';
		req.on("data",function(data){
			body += data;
		});
		req.on("end", function(){
			var post = qs.parse(body);
			options.hostname = post.hostname;
			options.path = post.path;
			request(options, function(string){
				res.end(string);
			});
		});
	}
};


var server = require("http").createServer(function (req, res) {
	res.writeHead(200, {"Access-Control-Allow-Origin":"*"});
	var pathname = require('url').parse(req.url, true).pathname.split("/");
	console.log(pathname);
	if(pathname[1] == "site"){
		methods.SITE(req, res); 
	}else{
		if(!db[pathname[1]]) return res.end("error table name");
		methods[req.method](req, res, pathname);
	}
});

server.listen(80,'127.0.0.1',function(){});

var options = {
	hostname: 'www.google.com',
	port: 80,
	path: '/upload',
	method: 'get'
};
var http = require("http");

function request(options, callback){
	var req = http.request(options,function(res){
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

	req.end();
};