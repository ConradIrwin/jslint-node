/*vim: set filetype=javascript: */
/*global require:false, process:false */

var sys = require('sys'),
     fs = require('fs'),
   path = require('path');

function loadDotJslints(file) {
    var dir = fs.realpathSync(file),
        value = "";

    do {

        dir = path.dirname(dir);
        try {
            value += fs.readFileSync(dir + "/.jslint") + "\n";
        } catch (e) { }

    } while (dir !== '/');

    return value;
}

(function (files) {

    var context = true;

    if (files[0] === '--no-context') {
        context = false;
        files.shift();
    }

    if (!files.length) {
        sys.puts("Usage: jslint file.js");
        process.exit(1);
    }

    files.forEach(function (file) {
        if (file === "--ignore-no-files") {
            return;
        }
        var input, success, dotjslint, dotjslintlength,
            JSLINT = require('./fulljslint.js').JSLINT;

        try {
            input = fs.readFileSync(file);
        } catch (e) {
            sys.puts(e);
            return;
        }

        dotjslint = loadDotJslints(file);
        dotjslintlength = dotjslint.split("\n").length;

        if (!input) {
            sys.puts("jslint: Couldn't open file '" + file + "'.");
            return;
        } else {
            input = dotjslint.toString("utf-8") + input.toString("utf8");
        }

        success = JSLINT(input,
            {
                bitwise:  true,
                eqeqeq:   true,
                immed:    true,
                newcap:   true,
                nomen:    true,
                onevar:   true,
                plusplus: true,
                regexp:   true,
                undef:    true,
                white:    true
            }
        );

        if (!success) {
            JSLINT.errors.forEach(function (e) {
                if (e) {
                    sys.puts(file + ':' + (e.line - dotjslintlength + 1) + ' character ' + e.character + ': ' + e.reason);
                    if (context) {
                        sys.puts('\t' + (e.evidence || '').replace(/^\s+|\s+$/, ""));
                    }
                }
            });
            process.exit(2);
        }
    });
}(process.argv.slice(2)));

