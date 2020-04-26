const { src, dest, watch, parallel, lastRun } = require("gulp");
const path = require("path");

const buildDist = () => src("./UeberPlayer.widget/**/*", {since: lastRun(buildDist)}).pipe(dest("./dist/UeberPlayer.widget"));

const dev = () => {
  const widgetLocation = `${process.env.HOME}/Library/Application Support/Übersicht/widgets`;

  watch("./UeberPlayer.widget/**/*", { ignoreInitial: false }, function watcher() {
    return buildDist().pipe(dest(path.join(widgetLocation, "UeberPlayer.widget")));
  });
}

exports.default = buildDist;
exports.dev = dev;
