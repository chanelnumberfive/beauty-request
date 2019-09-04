const path=require('path');
const {src,dest}=require('gulp');
const babel=require('gulp-babel');
const uglify=require('gulp-uglify');
const rename=require('gulp-rename');
const outPut=path.join(__dirname,'./../build');
function build(){
    return src(path.join(__dirname,'./../index.js'))
    .pipe(babel())
    .pipe(dest(outPut))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(outPut))
}
module.exports=build;