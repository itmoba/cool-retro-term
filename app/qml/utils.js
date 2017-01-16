.pragma library
function clamp(x, min, max) {
    if (x <= min) {
        return (min);
    }
    if (x >= max) {
        return (max);
    }
    return (x);
}

function lint(a, b, t) {
    /* return (1 - t) * a + (t) * b; */
    /* Re-ordered operation to make it faster, as it now involves
     * one instance of multiplication instead of two */
    return (a + ((b - a) * t)); 
}

function mix(c1, c2, alpha) {
    var z = 1 - alpha;
    return (Qt.rgba(c1.r * alpha + c2.r * z,
                   c1.g * alpha + c2.g * z,
                   c1.b * alpha + c2.b * z,
                   c1.a * alpha + c2.a * z));
}

function strToColor(s) {
    var f = 1/256;
    var r = parseInt(s.substring(1,3), 16) * f;
    var g = parseInt(s.substring(3,5), 16) * f;
    var b = parseInt(s.substring(5,7), 16) * f;
    return (Qt.rgba(r, g, b, 1.0));
}

/* Tokenizes a command into program and arguments, taking into account quoted
 * strings and backslashes.
 * Based on GLib's tokenizer, used by Gnome Terminal
 */
function tokenizeCommandLine(s){
    var args = [];
    var currentToken = "";
    var quoteChar = "";
    var escaped = false;
    var nextToken = function() {
        args.push(currentToken);
        currentToken = "";
    }
    var appendToCurrentToken = function(c) {
        currentToken += c;
    }

    for (var i = 0, slen = s.length; i < slen; ++i) {
        /* char followed by backslash, append literally */
        if (escaped) {
            escaped = false;
            appendToCurrentToken(s[i]);
        } else if (quoteChar) {
            /* char inside quotes, either close or append */
            escaped = s[i] === '\\';
            if (quoteChar === s[i]) {
                quoteChar = "";
                nextToken();
            } else if (!escaped) {
                appendToCurrentToken(s[i]);
            }
        } else {
            /* regular char */
            escaped = s[i] === '\\';
            switch (s[i]) {
                /* begin escape */
                case '\\' : {
                } break;
                /* newlines always delimits */
                case '\n':
                    nextToken();
                } break;
                /* delimit on new whitespace */
                case ' ' :
                case '\t' : {
                    if (currentToken) {
                        nextToken();
                    }
                } break;
                /* begin quoted section */
                case '\'' :
                case '"' : {
                    quoteChar = s[i];
                } break;
                default : {
                    appendToCurrentToken(s[i]);
                }
            }
        }
    }

    /* ignore last token if broken quotes/backslash */
    if (currentToken && !escaped && !quoteChar) {
        nextToken();
    }

    return (args);
}
