var express = require('express'),
	browserify = require('browserify-express');

var app = express();

var bundle = browserify({
    entry: __dirname + '/public/js/main.js',
    watch: __dirname + '/public/js/',
    mount: '/public/js/bundle.js',
    verbose: true,
    minify: true,
    insertGlobals: true,
    bundle_opts: { debug: true }, // enable inline sourcemap on js files 
    watch_opts: { recursive: false} // disable recursive file watch
});

app.use(bundle);
app.use(express.static(__dirname + '/public'));

app.listen(8030);
console.log('Listening on port 8030');
