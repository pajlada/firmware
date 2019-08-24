#!/usr/bin/env node
const fs = require('fs');
require('shelljs/global');

let skipAgent = false;

if (process.argv.length >= 3) {
  let extraArg = process.argv[2];

  skipAgent = (extraArg == '--skip-agent');
}

config.fatal = true;
config.verbose = true;

exec(`${__dirname}/generate-versions-h.js`);

const package = JSON.parse(fs.readFileSync(`${__dirname}/package.json`));
const version = package.firmwareVersion;
const releaseName = `uhk-firmware-${version}`;
const releaseDir = `${__dirname}/${releaseName}`;
const releaseFile = `${__dirname}/${releaseName}.tar.bz2`;
const agentDir = `${__dirname}/../lib/agent`;

const deviceSourceFirmwares = package.devices.map(device => `${__dirname}/../${device.source}`);
const moduleSourceFirmwares = package.modules.map(module => `${__dirname}/../${module.source}`);
rm('-rf', releaseDir, releaseFile, deviceSourceFirmwares, moduleSourceFirmwares);

exec(`cd ${__dirname}/../left; make clean; make -j8`);
exec(`cd ${__dirname}/../right; make clean; make -j8`);

if (!skipAgent) {
  exec(`git pull origin master; git checkout master`, { cwd: agentDir });
  exec(`npm ci`, { cwd: agentDir });
}

for (const device of package.devices) {
    const deviceDir = `${releaseDir}/devices/${device.name}`;
    const deviceSource = `${__dirname}/../${device.source}`;
    mkdir('-p', deviceDir);
    chmod(644, deviceSource);
    cp(deviceSource, `${deviceDir}/firmware.hex`);
    exec(`npm run convert-user-config-to-bin -- ${deviceDir}/config.bin`, { cwd: agentDir });
}

for (const module of package.modules) {
    const moduleDir = `${releaseDir}/modules`;
    const moduleSource = `${__dirname}/../${module.source}`;
    mkdir('-p', moduleDir);
    chmod(644, moduleSource);
    cp(moduleSource, `${moduleDir}/${module.name}.bin`);
}

cp(`${__dirname}/package.json`, releaseDir);
exec(`tar -cvjSf ${releaseFile} -C ${releaseDir} .`);
