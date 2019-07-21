#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const os = require('os');
const stream = require('stream');             
const {dirname:q, join:t, relative:u, resolve:v} = path;
const {createReadStream:w, createWriteStream:x, existsSync:y, lstat:z, mkdir:aa, readFileSync:A} = fs;
const B = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ba = (a, b = !1) => B(a, 2 + (b ? 1 : 0)), C = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:ca} = os;
const D = /\s+at.*(?:\(|\s)(.*)\)?/, da = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ea = ca(), E = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(da.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(D);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(D, (k, h) => k.replace(h, h.replace(ea, "~"))) : e).join("\n");
};
function fa(a, b, c = !1) {
  return function(d) {
    var f = C(arguments), {stack:e} = Error();
    const k = B(e, 2, !0), h = (e = d instanceof Error) ? d.message : d;
    f = [`Error: ${h}`, ...null !== f && a === f || c ? [b] : [k, b]].join("\n");
    f = E(f);
    return Object.assign(e ? d : Error(), {message:h, stack:f});
  };
}
;function F(a) {
  var {stack:b} = Error();
  const c = C(arguments);
  b = ba(b, a);
  return fa(c, b, a);
}
;function G(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function H(a, b, c) {
  const d = F(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:f} = a;
  if (!f) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((e, k) => {
    const h = (m, g) => m ? (m = d(m), k(m)) : e(c || g);
    let l = [h];
    Array.isArray(b) ? (b.forEach((m, g) => {
      G(f, g);
    }), l = [...b, h]) : 1 < Array.from(arguments).length && (G(f, 0), l = [b, h]);
    a(...l);
  });
}
;const I = async a => {
  try {
    return await H(z, a);
  } catch (b) {
    return null;
  }
};
const K = async a => {
  var b = await I(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await J(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let f;
      a.endsWith("/") || (f = c = await J(a), b = !0);
      if (!f) {
        c = await J(t(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? u("", c) : c, i:d};
}, J = async a => {
  a = `${a}.js`;
  let b = await I(a);
  b || (a = `${a}x`);
  if (b = await I(a)) {
    return a;
  }
};
var ha = stream;
const {Transform:ia, Writable:ja} = stream;
const ka = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class la extends ja {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {h:e = F(!0), proxyError:k} = a || {}, h = (l, m) => e(m);
    super(b);
    this.a = [];
    this.c = new Promise((l, m) => {
      this.on("finish", () => {
        let g;
        d ? g = Buffer.concat(this.a) : g = this.a.join("");
        l(g);
        this.a = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          h`${g}`;
        } else {
          const n = E(g.stack);
          g.stack = n;
          k && h`${g}`;
        }
        m(g);
      });
      f && ka(this, f).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.c;
  }
}
const L = async a => {
  var b = void 0 === b ? {} : b;
  ({b:a} = new la(Object.assign({}, {rs:a}, b, {h:F(!0)})));
  return await a;
};
async function M(a) {
  a = w(a);
  return await L(a);
}
;async function N(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = F(!0), d = x(a);
  await new Promise((f, e) => {
    d.on("error", k => {
      k = c(k);
      e(k);
    }).on("close", f).end(b);
  });
}
;async function ma(a) {
  const b = q(a);
  try {
    return await O(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function O(a) {
  try {
    await H(aa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = q(a);
      await O(c);
      await O(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;function na(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const P = (a, b) => {
  if (!(b instanceof Error)) {
    throw b;
  }
  [, , a] = a.stack.split("\n", 3);
  a = b.stack.indexOf(a);
  if (-1 == a) {
    throw b;
  }
  a = b.stack.substr(0, a - 1);
  const c = a.lastIndexOf("\n");
  b.stack = a.substr(0, c);
  throw b;
};
async function Q(a, b) {
  b instanceof ha ? b.pipe(a) : a.end(b);
  return await L(a);
}
async function oa(a, b) {
  return await a.b.reduce(async(c, {re:d, replacement:f}) => {
    c = await c;
    if (a.a) {
      return c;
    }
    if ("string" == typeof f) {
      c = c.replace(d, f);
    } else {
      const e = [];
      let k;
      const h = c.replace(d, (l, ...m) => {
        k = Error();
        try {
          if (a.a) {
            return e.length ? e.push(Promise.resolve(l)) : l;
          }
          const g = f.call(a, l, ...m);
          g instanceof Promise && e.push(g);
          return g;
        } catch (g) {
          P(k, g);
        }
      });
      if (e.length) {
        try {
          const l = await Promise.all(e);
          c = c.replace(d, () => l.shift());
        } catch (l) {
          P(k, l);
        }
      } else {
        c = h;
      }
    }
    return c;
  }, `${b}`);
}
class R extends ia {
  constructor(a, b) {
    super(b);
    this.b = (Array.isArray(a) ? a : [a]).filter(na);
    this.a = !1;
    this.f = b;
  }
  async replace(a, b) {
    const c = new R(this.b, this.f);
    b && Object.assign(c, b);
    a = await Q(c, a);
    c.a && this.brake();
    b && Object.keys(b).forEach(d => {
      b[d] = c[d];
    });
    return a;
  }
  brake() {
    this.a = !0;
  }
  async _transform(a, b, c) {
    try {
      const d = await oa(this, a);
      this.push(d);
      c();
    } catch (d) {
      a = E(d.stack), d.stack = a, c(d);
    }
  }
}
;const [, , S] = process.argv;
var T;
{
  let a;
  try {
    a = require(v(S));
  } catch (b) {
    const c = t(process.cwd(), S);
    a = require(v(c));
  }
  T = a;
}
const {entry:U, js:V, destination:pa} = T;
let W, X = W;
try {
  W = A(U).toString();
} catch (a) {
  if ("ENOENT" != a.code) {
    throw a;
  }
  try {
    X = require.resolve();
  } catch (b) {
    const c = t(process.cwd(), "node_modules", U);
    X = require.resolve(c);
  }
  W = A(X).toString();
}
const qa = q(X), ra = q(V), [, Y] = W.split("/* typework */\n");
Y || (console.log("/* typework */ marker not found in %s", u("", X)), process.exit(1));
const sa = A(V).toString(), Z = /import\(['"](\..+?)['"]\)/g, xa = async() => {
  let a = {};
  var b = new R({re:Z, async replacement(c, d) {
    let f = t(pa, d);
    var e = u(ra, f);
    if (d in a) {
      return a[d];
    }
    e = `import('${e}')`;
    a[d] = e;
    console.log("Detected %s", d);
    const k = t(qa, d);
    let h;
    try {
      ({path:h} = await K(k));
    } catch (g) {
      return console.log("Could not resolve %s from %s", d, X), c;
    }
    f.endsWith(".js") || (f = h.endsWith("index.js") ? t(f, "index.js") : f + ".js");
    c = await M(h);
    const l = c.split(/\n/g), m = q(h);
    d = new R({re:Z, async replacement(g, n, r) {
      const ta = t(m, n);
      var p;
      try {
        ({path:p} = await K(ta));
      } catch (ua) {
        this.brake();
        for (p = g = 0; p < r;) {
          p += l[g].length, g++;
        }
        g = {line:g, g:p - r};
        const {line:va, g:wa} = g;
        console.log("Could not resolve %s from %s:%s:%s", n, h, va, wa);
        throw ua;
      }
      r = u(q(f), V);
      if (p == X) {
        return r = r.replace(/(\/index)?\.js$/, ""), `import('${r}')`;
      }
      r = q(f);
      n = t(r, n);
      n.endsWith(".js") || (n = p.endsWith("index.js") ? t(n, "index.js") : n + ".js");
      y(n) || (p = await M(p), await N(n, p));
      return g;
    }});
    c = await Q(d, c);
    await ma(f);
    await N(f, c);
    return e;
  }});
  b = await Q(b, Y);
  b = sa.replace(/\/\* typework \*\/\n(?:([^\n][\s\S]+?\n))?$/, `/* typework */
${b}`);
  await N(V, b);
};
(async() => {
  try {
    await xa();
  } catch (a) {
    process.env.DEBUG ? console.error(a.stack) : console.log(a.message);
  }
})();

