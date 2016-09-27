/*Copyright (c) 2016, Danielle Albers Szafir, Deidre Stuffer, Yusef Sohail, & Michael Gleicher
#All rights reserved.
#
#Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
#
#1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
#
#2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
#
#THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

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