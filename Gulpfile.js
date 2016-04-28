var gulp = require("gulp"), 
	concat = require("gulp-concat");


gulp.task("gfx", function () {
	gulp.src([
		"app/static/gfx/gfx.js",
		"app/static/gfx/grid.js",
		"app/static/gfx/init.js",
		"app/static/gfx/localseries.js",
		"app/static/gfx/region.js",
		"app/static/gfx/render.js",
		"app/static/gfx/textures.js",
		"app/static/gfx/util.js"
		])
		.pipe(concat("gfx.js"))
		.pipe(gulp.dest("app/static/gfx/dist/"));

})

gulp.task("watch", function () {
	gulp.watch(["app/static/gfx/*.js"], ["gfx"]);
})

gulp.task("default", ["watch", "gfx"]);


var express = require("express")
var path = require("path")
var app = express();
app.use(express.static( path.join(__dirname, "/app/")))
app.listen(5050);