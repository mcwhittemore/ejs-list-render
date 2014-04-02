# EJS List Render

A templete-esq soltion for ejs rendering.

## Usage

`npm install ejs-list-render`

ELR expects all templates other than the last one in the list to have a `<%- __yield %>` callout.

```
var elr = require("ejs-list-render");
elr(["outerfile.ejs", "middlefile.ejs", "and.ejs", "so-on.ejs"], {data:"for all files"}, function(err, html){
	if(err){
		//you're most likely missing a required parameter
	}
	else{
		//you're html is ready
	}
});
```

## Usage With Connect

```
var app = require("connect")();
var elr = require("ejs-list-render");
app.use(elr.connect);

//Then when responding

res.render(["outter.ejs", "inner.ejs"], {"data":"for all files"});
```

## Usage With Express: elr.express(opts)

```
var app = require("express")();
var elr = require("ejs-list-render");
app.set('views', path.join(__dirname, 'views'));
app.use(elr.express({name:"listRender", data: {title:"My Site"}}));

app.get("/", function(req, res, next){
	res.listRender(["outer", "inner"], {"data":"for all files"});
});
```

### Express Options

* name: optional. Sets the res attribute the list-render function is on. Default: listRender
* data: optional. default data to be used for every request unless over written by the provided data object.
