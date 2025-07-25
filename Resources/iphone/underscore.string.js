!function(e, n) {
    "use strict";
    function r(e, n) {
        var r, t, u = e.toLowerCase();
        for (n = [].concat(n), r = 0; n.length > r; r += 1) if (t = n[r]) {
            if (t.test && t.test(e)) return !0;
            if (t.toLowerCase() === u) return !0;
        }
    }
    var t = n.prototype.trim, u = n.prototype.trimRight, i = n.prototype.trimLeft, l = function(e) {
        return 1 * e || 0;
    }, o = function(e, n) {
        if (1 > n) return "";
        for (var r = ""; n > 0; ) 1 & n && (r += e), n >>= 1, e += e;
        return r;
    }, a = [].slice, c = function(e) {
        return null == e ? "\\s" : e.source ? e.source : "[" + g.escapeRegExp(e) + "]";
    }, s = {
        lt: "<",
        gt: ">",
        quot: '"',
        amp: "&",
        apos: "'"
    }, f = {};
    for (var p in s) f[s[p]] = p;
    f["'"] = "#39";
    var h = function() {
        function e(e) {
            return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
        }
        var r = o, t = function() {
            return t.cache.hasOwnProperty(arguments[0]) || (t.cache[arguments[0]] = t.parse(arguments[0])), 
            t.format.call(null, t.cache[arguments[0]], arguments);
        };
        return t.format = function(t, u) {
            var i, l, o, a, c, s, f, p = 1, g = t.length, d = "", m = [];
            for (l = 0; g > l; l++) if (d = e(t[l]), "string" === d) m.push(t[l]); else if ("array" === d) {
                if (a = t[l], a[2]) for (i = u[p], o = 0; a[2].length > o; o++) {
                    if (!i.hasOwnProperty(a[2][o])) throw new Error(h('[_.sprintf] property "%s" does not exist', a[2][o]));
                    i = i[a[2][o]];
                } else i = a[1] ? u[a[1]] : u[p++];
                if (/[^s]/.test(a[8]) && "number" != e(i)) throw new Error(h("[_.sprintf] expecting number but found %s", e(i)));
                switch (a[8]) {
                  case "b":
                    i = i.toString(2);
                    break;

                  case "c":
                    i = n.fromCharCode(i);
                    break;

                  case "d":
                    i = parseInt(i, 10);
                    break;

                  case "e":
                    i = a[7] ? i.toExponential(a[7]) : i.toExponential();
                    break;

                  case "f":
                    i = a[7] ? parseFloat(i).toFixed(a[7]) : parseFloat(i);
                    break;

                  case "o":
                    i = i.toString(8);
                    break;

                  case "s":
                    i = (i = n(i)) && a[7] ? i.substring(0, a[7]) : i;
                    break;

                  case "u":
                    i = Math.abs(i);
                    break;

                  case "x":
                    i = i.toString(16);
                    break;

                  case "X":
                    i = i.toString(16).toUpperCase();
                }
                i = /[def]/.test(a[8]) && a[3] && i >= 0 ? "+" + i : i, s = a[4] ? "0" == a[4] ? "0" : a[4].charAt(1) : " ", 
                f = a[6] - n(i).length, c = a[6] ? r(s, f) : "", m.push(a[5] ? i + c : c + i);
            }
            return m.join("");
        }, t.cache = {}, t.parse = function(e) {
            for (var n = e, r = [], t = [], u = 0; n; ) {
                if (null !== (r = /^[^\x25]+/.exec(n))) t.push(r[0]); else if (null !== (r = /^\x25{2}/.exec(n))) t.push("%"); else {
                    if (null === (r = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(n))) throw new Error("[_.sprintf] huh?");
                    if (r[2]) {
                        u |= 1;
                        var i = [], l = r[2], o = [];
                        if (null === (o = /^([a-z_][a-z_\d]*)/i.exec(l))) throw new Error("[_.sprintf] huh?");
                        for (i.push(o[1]); "" !== (l = l.substring(o[0].length)); ) if (null !== (o = /^\.([a-z_][a-z_\d]*)/i.exec(l))) i.push(o[1]); else {
                            if (null === (o = /^\[(\d+)\]/.exec(l))) throw new Error("[_.sprintf] huh?");
                            i.push(o[1]);
                        }
                        r[2] = i;
                    } else u |= 2;
                    if (3 === u) throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");
                    t.push(r);
                }
                n = n.substring(r[0].length);
            }
            return t;
        }, t;
    }(), g = {
        VERSION: "2.3.0",
        isBlank: function(e) {
            return null == e && (e = ""), /^\s*$/.test(e);
        },
        stripTags: function(e) {
            return null == e ? "" : n(e).replace(/<\/?[^>]+>/g, "");
        },
        capitalize: function(e) {
            return e = null == e ? "" : n(e), e.charAt(0).toUpperCase() + e.slice(1);
        },
        chop: function(e, r) {
            return null == e ? [] : (e = n(e), r = ~~r, r > 0 ? e.match(new RegExp(".{1," + r + "}", "g")) : [ e ]);
        },
        clean: function(e) {
            return g.strip(e).replace(/\s+/g, " ");
        },
        count: function(e, r) {
            if (null == e || null == r) return 0;
            e = n(e), r = n(r);
            for (var t = 0, u = 0, i = r.length; ;) {
                if (u = e.indexOf(r, u), -1 === u) break;
                t++, u += i;
            }
            return t;
        },
        chars: function(e) {
            return null == e ? [] : n(e).split("");
        },
        swapCase: function(e) {
            return null == e ? "" : n(e).replace(/\S/g, function(e) {
                return e === e.toUpperCase() ? e.toLowerCase() : e.toUpperCase();
            });
        },
        escapeHTML: function(e) {
            return null == e ? "" : n(e).replace(/[&<>"']/g, function(e) {
                return "&" + f[e] + ";";
            });
        },
        unescapeHTML: function(e) {
            return null == e ? "" : n(e).replace(/\&([^;]+);/g, function(e, r) {
                var t;
                return r in s ? s[r] : (t = r.match(/^#x([\da-fA-F]+)$/)) ? n.fromCharCode(parseInt(t[1], 16)) : (t = r.match(/^#(\d+)$/)) ? n.fromCharCode(~~t[1]) : e;
            });
        },
        escapeRegExp: function(e) {
            return null == e ? "" : n(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        },
        splice: function(e, n, r, t) {
            var u = g.chars(e);
            return u.splice(~~n, ~~r, t), u.join("");
        },
        insert: function(e, n, r) {
            return g.splice(e, n, 0, r);
        },
        include: function(e, r) {
            return "" === r ? !0 : null == e ? !1 : -1 !== n(e).indexOf(r);
        },
        join: function() {
            var e = a.call(arguments), n = e.shift();
            return null == n && (n = ""), e.join(n);
        },
        lines: function(e) {
            return null == e ? [] : n(e).split("\n");
        },
        reverse: function(e) {
            return g.chars(e).reverse().join("");
        },
        startsWith: function(e, r) {
            return "" === r ? !0 : null == e || null == r ? !1 : (e = n(e), r = n(r), e.length >= r.length && e.slice(0, r.length) === r);
        },
        endsWith: function(e, r) {
            return "" === r ? !0 : null == e || null == r ? !1 : (e = n(e), r = n(r), e.length >= r.length && e.slice(e.length - r.length) === r);
        },
        succ: function(e) {
            return null == e ? "" : (e = n(e), e.slice(0, -1) + n.fromCharCode(e.charCodeAt(e.length - 1) + 1));
        },
        titleize: function(e) {
            return null == e ? "" : (e = n(e).toLowerCase(), e.replace(/(?:^|\s|-)\S/g, function(e) {
                return e.toUpperCase();
            }));
        },
        camelize: function(e) {
            return g.trim(e).replace(/[-_\s]+(.)?/g, function(e, n) {
                return n ? n.toUpperCase() : "";
            });
        },
        underscored: function(e) {
            return g.trim(e).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
        },
        dasherize: function(e) {
            return g.trim(e).replace(/([A-Z])/g, "-$1").replace(/[-_\s]+/g, "-").toLowerCase();
        },
        classify: function(e) {
            return g.titleize(n(e).replace(/[\W_]/g, " ")).replace(/\s/g, "");
        },
        humanize: function(e) {
            return g.capitalize(g.underscored(e).replace(/_id$/, "").replace(/_/g, " "));
        },
        trim: function(e, r) {
            return null == e ? "" : !r && t ? t.call(e) : (r = c(r), n(e).replace(new RegExp("^" + r + "+|" + r + "+$", "g"), ""));
        },
        ltrim: function(e, r) {
            return null == e ? "" : !r && i ? i.call(e) : (r = c(r), n(e).replace(new RegExp("^" + r + "+"), ""));
        },
        rtrim: function(e, r) {
            return null == e ? "" : !r && u ? u.call(e) : (r = c(r), n(e).replace(new RegExp(r + "+$"), ""));
        },
        truncate: function(e, r, t) {
            return null == e ? "" : (e = n(e), t = t || "...", r = ~~r, e.length > r ? e.slice(0, r) + t : e);
        },
        prune: function(e, r, t) {
            if (null == e) return "";
            if (e = n(e), r = ~~r, t = null != t ? n(t) : "...", r >= e.length) return e;
            var u = function(e) {
                return e.toUpperCase() !== e.toLowerCase() ? "A" : " ";
            }, i = e.slice(0, r + 1).replace(/.(?=\W*\w*$)/g, u);
            return i = i.slice(i.length - 2).match(/\w\w/) ? i.replace(/\s*\S+$/, "") : g.rtrim(i.slice(0, i.length - 1)), 
            (i + t).length > e.length ? e : e.slice(0, i.length) + t;
        },
        words: function(e, n) {
            return g.isBlank(e) ? [] : g.trim(e, n).split(n || /\s+/);
        },
        pad: function(e, r, t, u) {
            e = null == e ? "" : n(e), r = ~~r;
            var i = 0;
            switch (t ? t.length > 1 && (t = t.charAt(0)) : t = " ", u) {
              case "right":
                return i = r - e.length, e + o(t, i);

              case "both":
                return i = r - e.length, o(t, Math.ceil(i / 2)) + e + o(t, Math.floor(i / 2));

              default:
                return i = r - e.length, o(t, i) + e;
            }
        },
        lpad: function(e, n, r) {
            return g.pad(e, n, r);
        },
        rpad: function(e, n, r) {
            return g.pad(e, n, r, "right");
        },
        lrpad: function(e, n, r) {
            return g.pad(e, n, r, "both");
        },
        sprintf: h,
        vsprintf: function(e, n) {
            return n.unshift(e), h.apply(null, n);
        },
        toNumber: function(e, n) {
            return e ? (e = g.trim(e), e.match(/^-?\d+(?:\.\d+)?$/) ? l(l(e).toFixed(~~n)) : 0/0) : 0;
        },
        numberFormat: function(e, n, r, t) {
            if (isNaN(e) || null == e) return "";
            e = e.toFixed(~~n), t = "string" == typeof t ? t : ",";
            var u = e.split("."), i = u[0], l = u[1] ? (r || ".") + u[1] : "";
            return i.replace(/(\d)(?=(?:\d{3})+$)/g, "$1" + t) + l;
        },
        strRight: function(e, r) {
            if (null == e) return "";
            e = n(e), r = null != r ? n(r) : r;
            var t = r ? e.indexOf(r) : -1;
            return ~t ? e.slice(t + r.length, e.length) : e;
        },
        strRightBack: function(e, r) {
            if (null == e) return "";
            e = n(e), r = null != r ? n(r) : r;
            var t = r ? e.lastIndexOf(r) : -1;
            return ~t ? e.slice(t + r.length, e.length) : e;
        },
        strLeft: function(e, r) {
            if (null == e) return "";
            e = n(e), r = null != r ? n(r) : r;
            var t = r ? e.indexOf(r) : -1;
            return ~t ? e.slice(0, t) : e;
        },
        strLeftBack: function(e, n) {
            if (null == e) return "";
            e += "", n = null != n ? "" + n : n;
            var r = e.lastIndexOf(n);
            return ~r ? e.slice(0, r) : e;
        },
        toSentence: function(e, n, r, t) {
            n = n || ", ", r = r || " and ";
            var u = e.slice(), i = u.pop();
            return e.length > 2 && t && (r = g.rtrim(n) + r), u.length ? u.join(n) + r + i : i;
        },
        toSentenceSerial: function() {
            var e = a.call(arguments);
            return e[3] = !0, g.toSentence.apply(g, e);
        },
        slugify: function(e) {
            if (null == e) return "";
            var r = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź", t = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz", u = new RegExp(c(r), "g");
            return e = n(e).toLowerCase().replace(u, function(e) {
                var n = r.indexOf(e);
                return t.charAt(n) || "-";
            }), g.dasherize(e.replace(/[^\w\s-]/g, ""));
        },
        surround: function(e, n) {
            return [ n, e, n ].join("");
        },
        quote: function(e, n) {
            return g.surround(e, n || '"');
        },
        unquote: function(e, n) {
            return n = n || '"', e[0] === n && e[e.length - 1] === n ? e.slice(1, e.length - 1) : e;
        },
        exports: function() {
            var e = {};
            for (var n in this) this.hasOwnProperty(n) && !n.match(/^(?:include|contains|reverse)$/) && (e[n] = this[n]);
            return e;
        },
        repeat: function(e, r, t) {
            if (null == e) return "";
            if (r = ~~r, null == t) return o(n(e), r);
            for (var u = []; r > 0; u[--r] = e) ;
            return u.join(t);
        },
        naturalCmp: function(e, r) {
            if (e == r) return 0;
            if (!e) return -1;
            if (!r) return 1;
            for (var t = /(\.\d+)|(\d+)|(\D+)/g, u = n(e).toLowerCase().match(t), i = n(r).toLowerCase().match(t), l = Math.min(u.length, i.length), o = 0; l > o; o++) {
                var a = u[o], c = i[o];
                if (a !== c) {
                    var s = parseInt(a, 10);
                    if (!isNaN(s)) {
                        var f = parseInt(c, 10);
                        if (!isNaN(f) && s - f) return s - f;
                    }
                    return c > a ? -1 : 1;
                }
            }
            return u.length === i.length ? u.length - i.length : r > e ? -1 : 1;
        },
        levenshtein: function(e, r) {
            if (null == e && null == r) return 0;
            if (null == e) return n(r).length;
            if (null == r) return n(e).length;
            e = n(e), r = n(r);
            for (var t, u, i = [], l = 0; r.length >= l; l++) for (var o = 0; e.length >= o; o++) u = l && o ? e.charAt(o - 1) === r.charAt(l - 1) ? t : Math.min(i[o], i[o - 1], t) + 1 : l + o, 
            t = i[o], i[o] = u;
            return i.pop();
        },
        toBoolean: function(e, n, t) {
            return "number" == typeof e && (e = "" + e), "string" != typeof e ? !!e : (e = g.trim(e), 
            r(e, n || [ "true", "1" ]) ? !0 : r(e, t || [ "false", "0" ]) ? !1 : void 0);
        }
    };
    g.strip = g.trim, g.lstrip = g.ltrim, g.rstrip = g.rtrim, g.center = g.lrpad, g.rjust = g.lpad, 
    g.ljust = g.rpad, g.contains = g.include, g.q = g.quote, g.toBool = g.toBoolean, 
    "undefined" != typeof exports && ("undefined" != typeof module && module.exports && (module.exports = g), 
    exports._s = g), "function" == typeof define && define.amd && define("underscore.string", [], function() {
        return g;
    }), e._ = e._ || {}, e._.string = e._.str = g;
}(this, String);