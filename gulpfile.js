const { src, dest, watch, series, lastRun } = require("gulp");
const zip = require("gulp-zip");
const path = require("path");

const buildDist = () => src("./UeberPlayer.widget/**/*", {since: lastRun(buildDist)}).pipe(dest("./dist/UeberPlayer.widget"));

const makeZip = () => src("./UeberPlayer.widget/**").pipe(zip("UeberPlayer.widget.zip")).pipe(dest("./"));

const dev = () => {
  const widgetLocation = `${process.env.HOME}/Library/Application Support/Übersicht/widgets`;

  watch("./UeberPlayer.widget/**/*", { ignoreInitial: false }, function watcher() {
    return buildDist().pipe(dest(path.join(widgetLocation, "UeberPlayer.widget")));
  });
}

exports.default = buildDist;
exports.release = series(exports.default, makeZip);
exports.dev = dev;
