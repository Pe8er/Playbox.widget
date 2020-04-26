const { src, dest, watch, parallel, lastRun } = require("gulp");
const path = require("path");

const distSrc = () => src("./UeberPlayer.widget/**/*", {since: lastRun(distSrc)}).pipe(dest("./dist/UeberPlayer.widget"));

const distModules = () =>  src("./node_modules/**/*", {since: lastRun(distModules)}).pipe(dest("./dist/UeberPlayer.widget/node_modules"));

const dev = () => {
  const widgetLocation = `${process.env.HOME}/Library/Application Support/Übersicht/widgets`;

  watch("./UeberPlayer.widget/**/*", { ignoreInitial: false }, function watcher() {
    return distSrc().pipe(dest(path.join(widgetLocation, "UeberPlayer.widget")));
  });

  watch("./node_modules/**/*", { ignoreInitial: false }, function watcher() {
    return distModules().pipe(dest(path.join(widgetLocation, "UeberPlayer.widget/node_modules")));
  });
}

exports.default = parallel(distSrc, distModules);
exports.dev = dev;
