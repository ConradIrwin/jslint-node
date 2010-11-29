/*vim: set filetype=javascript: */
/*global require:false, process:false */

(function (file) {
    var e, i, input, len, success, pad,
        sys = require("sys"),
        fs = require("fs"),
        JSLINT = require('./fulljslint.js').JSLINT;

    if (!file) {
        sys.puts("Usage: jslint file.js");
        process.exit(1);
    }

    input = fs.readFileSync(file);
    if (!input) {
        sys.puts("jslint: Couldn't open file '" + file + "'.");
        process.exit(1);
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
        sys.puts(JSLINT.errors.length);
        JSLINT.errors.forEach(function (e) {
            sys.puts(' ' + e.line + ',' + e.character + ': ' + e.reason);
            sys.puts('    ' + (e.evidence || '').replace(/^\s+|\s+$/, ""));
        });
        process.exit(2);
    }

}(process.ARGV[2]));
