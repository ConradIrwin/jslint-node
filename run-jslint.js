/*vim: set filetype=javascript: */
/*global require:false, process:false, sys:false */

(function (files) {

    if (!files.length) {
        sys.puts("Usage: jslint file.js");
        process.exit(1);
    }
    files.forEach(function (file) {
        var input, success,
            sys = require("sys"),
            fs = require("fs"),
            JSLINT = require('./fulljslint.js').JSLINT;

        input = fs.readFileSync(file);
        if (!input) {
            sys.puts("jslint: Couldn't open file '" + file + "'.");
            return;
        } else {
            input = input.toString("utf8");
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
                    sys.puts(file + ':' + e.line + ':' + e.character + ': ' + e.reason);
                    sys.puts('\t' + (e.evidence || '').replace(/^\s+|\s+$/, ""));
                }
            });
        }
    });
}(process.argv.slice(2)));
