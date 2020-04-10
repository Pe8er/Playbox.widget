const { src, dest, watch } = require("gulp");
const path = require("path");

const buildDist = () => {
  console.log("Building dist/...");

  const widget = src("./UeberPlayer.widget/*").pipe(dest("./dist/UeberPlayer.widget"));

  return widget;
}

const dev = () => {
  const widgetLocation = `${process.env.HOME}/Library/Application Support/Übersicht/widgets`;

  watch("./UeberPlayer.widget/*", { ignoreInitial: false }, function watcher() {
    return buildDist().pipe(dest(path.join(widgetLocation, "UeberPlayer.widget")));
  });
}

exports.default = buildDist;
exports.dev = dev;
