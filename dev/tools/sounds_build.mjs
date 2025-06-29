import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";

const waveBaseDir = "dev/sounds_wave";

const fileList = new Promise((resolve, reject) => {
  fs.readdir(waveBaseDir, (err, files) => {
    if (err) reject(err);
    resolve(files);
  });
});

function soundExists(soundWithoutExt) {
  return (
    fs.existsSync(makeMp3path(soundWithoutExt)) &&
    fs.existsSync(makeWebmpath(soundWithoutExt))
  );
}

function clbk(error, stdout, stderr, outpath) {
  if (error) {
    console.log("Error creating " + outpath + " (" + error + ")");
    return;
  }
  console.log("Done creating " + outpath);
}

function makeMp3path(soundWithoutExt) {
  return "public/sounds/" + soundWithoutExt + ".mp3";
}

function makeWebmpath(soundWithoutExt) {
  return "public/sounds/" + soundWithoutExt + ".webm";
}

function convert(soundWithoutExt) {
  const wav = waveBaseDir + "/" + soundWithoutExt + ".wav";
  console.log("convert " + wav);
  const mp3path = makeMp3path(soundWithoutExt);
  exec(
    'ffmpeg -i "' +
      wav +
      '" -vn -ac 2 -ar 44100 -ab 256k -acodec libmp3lame -f mp3 "' +
      mp3path +
      '"',
    (error, stdout, stderr) => {
      clbk(error, stdout, stderr, mp3path);
    }
  );
  const webmpath = makeWebmpath(soundWithoutExt);
  exec(
    'ffmpeg -i "' + wav + '" -dash 1 "' + webmpath + '"',
    (error, stdout, stderr) => {
      clbk(error, stdout, stderr, webmpath);
    }
  );
}

console.log("checking ffmpeg...");
let ffmpegver = "";
try {
  ffmpegver = execSync("ffmpeg -version").toString();
} catch (e) {
  console.log("error: " + e);
  console.log("ffmpeg not found. please install.");
  process.exit(1);
}

if (!ffmpegver.startsWith("ffmpeg version")) {
  console.log("Unrecognized ffmpeg version message. Is this really ffmpeg?");
  process.exit(1);
}

console.log(ffmpegver.split("\n")[0]);

fileList.then((files) => {
  files.forEach((v) => {
    const soundWithoutExt = path.basename(v, ".wav");
    if (!soundExists(soundWithoutExt)) {
      convert(soundWithoutExt);
    }
  });
});
