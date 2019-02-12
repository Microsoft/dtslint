"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const definitelytyped_header_parser_1 = require("definitelytyped-header-parser");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const installsDir = path.join(os.homedir(), ".dts", "typescript-installs");
function installAll() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const v of definitelytyped_header_parser_1.TypeScriptVersion.all) {
            // manually instead typescript@next outside the loop
            if (v === definitelytyped_header_parser_1.TypeScriptVersion.all[definitelytyped_header_parser_1.TypeScriptVersion.all.length - 1]) {
                continue;
            }
            ;
            yield install(v);
        }
        yield installNext();
    });
}
exports.installAll = installAll;
function installNext() {
    return __awaiter(this, void 0, void 0, function* () {
        yield install("next");
    });
}
exports.installNext = installNext;
function install(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = installDir(version);
        if (!(yield fs.pathExists(dir))) {
            console.log(`Installing to ${dir}...`);
            yield fs.mkdirp(dir);
            yield fs.writeJson(path.join(dir, "package.json"), packageJson(version));
            yield execAndThrowErrors("npm install --ignore-scripts --no-shrinkwrap --no-package-lock --no-bin-links", dir);
            console.log("Installed!");
        }
    });
}
function cleanInstalls() {
    return fs.remove(installsDir);
}
exports.cleanInstalls = cleanInstalls;
function typeScriptPath(version) {
    return path.join(installDir(version), "node_modules", "typescript");
}
exports.typeScriptPath = typeScriptPath;
function installDir(version) {
    return path.join(installsDir, version);
}
/** Run a command and return the stdout, or if there was an error, throw. */
function execAndThrowErrors(cmd, cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            child_process_1.exec(cmd, { encoding: "utf8", cwd }, (err, _stdout, stderr) => {
                console.error(stderr);
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
function packageJson(version) {
    return {
        description: `Installs typescript@${version}`,
        repository: "N/A",
        license: "MIT",
        dependencies: {
            typescript: version,
        },
    };
}
//# sourceMappingURL=installer.js.map