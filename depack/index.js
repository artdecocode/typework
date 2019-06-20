#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const os = require('os');
const stream = require('stream');             
const {dirname:p, join:q, relative:r, resolve:u} = path;
const {createReadStream:v, createWriteStream:w, existsSync:x, lstat:y, mkdir:z, readFileSync:A} = fs;
const B = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, C = (a, b = !1) => B(a, 2 + (b ? 1 : 0)), D = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:E} = os;
const F = /\s+at.*(?:\(|\s)(.*)\)?/, aa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ba = E(), G = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(aa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(F);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(F, (k, l) => k.replace(l, l.replace(ba, "~"))) : e).join("\n");
};
function ca(a, b, c = !1) {
  return function(d) {
    var f = D(arguments), {stack:e} = Error();
    const k = B(e, 2, !0), l = (e = d instanceof Error) ? d.message : d;
    f = [`Error: ${l}`, ...null !== f && a === f || c ? [b] : [k, b]].join("\n");
    f = G(f);
    return Object.assign(e ? d : Error(), {message:l, stack:f});
  };
}
;function H(a) {
  var {stack:b} = Error();
  const c = D(arguments);
  b = C(b, a);
  return ca(c, b, a);
}
;function I(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function J(a, b, c) {
  const d = H(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:f} = a;
  if (!f) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((e, k) => {
    const l = (m, g) => m ? (m = d(m), k(m)) : e(c || g);
    let h = [l];
    Array.isArray(b) ? (b.forEach((m, g) => {
      I(f, g);
    }), h = [...b, l]) : 1 < Array.from(arguments).length && (I(f, 0), h = [b, l]);
    a(...h);
  });
}
;const K = async a => {
  try {
    return await J(y, a);
  } catch (b) {
    return null;
  }
};
const M = async a => {
  var b = await K(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await L(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let f;
      a.endsWith("/") || (f = c = await L(a), b = !0);
      if (!f) {
        c = await L(q(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? r("", c) : c, h:d};
}, L = async a => {
  a = `${a}.js`;
  let b = await K(a);
  b || (a = `${a}x`);
  if (b = await K(a)) {
    return a;
  }
};
var da = stream;
const {Transform:ea, Writable:fa} = stream;
const ha = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class ia extends fa {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {g:e = H(!0), proxyError:k} = a || {}, l = (h, m) => e(m);
    super(b);
    this.a = [];
    this.c = new Promise((h, m) => {
      this.on("finish", () => {
        let g;
        d ? g = Buffer.concat(this.a) : g = this.a.join("");
        h(g);
        this.a = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          l`${g}`;
        } else {
          const n = G(g.stack);
          g.stack = n;
          k && l`${g}`;
        }
        m(g);
      });
      f && ha(this, f).pipe(this);
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
const N = async a => {
  var b = void 0 === b ? {} : b;
  ({b:a} = new ia(Object.assign({}, {rs:a}, b, {g:H(!0)})));
  return await a;
};
async function O(a) {
  a = v(a);
  return await N(a);
}
;async function P(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = H(!0), d = w(a);
  await new Promise((f, e) => {
    d.on("error", k => {
      k = c(k);
      e(k);
    }).on("close", f).end(b);
  });
}
;async function ja(a) {
  const b = p(a);
  try {
    return await Q(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function Q(a) {
  try {
    await J(z, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = p(a);
      await Q(c);
      await Q(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;function ka(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const R = (a, b) => {
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
async function S(a, b) {
  b instanceof da ? b.pipe(a) : a.end(b);
  return await N(a);
}
async function la(a, b) {
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
      const l = c.replace(d, (h, ...m) => {
        k = Error();
        try {
          if (a.a) {
            return e.length ? e.push(Promise.resolve(h)) : h;
          }
          const g = f.call(a, h, ...m);
          g instanceof Promise && e.push(g);
          return g;
        } catch (g) {
          R(k, g);
        }
      });
      if (e.length) {
        try {
          const h = await Promise.all(e);
          c = c.replace(d, () => h.shift());
        } catch (h) {
          R(k, h);
        }
      } else {
        c = l;
      }
    }
    return c;
  }, `${b}`);
}
class T extends ea {
  constructor(a, b) {
    super(b);
    this.b = (Array.isArray(a) ? a : [a]).filter(ka);
    this.a = !1;
    this.f = b;
  }
  async replace(a, b) {
    const c = new T(this.b, this.f);
    b && Object.assign(c, b);
    a = await S(c, a);
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
      const d = await la(this, a);
      this.push(d);
      c();
    } catch (d) {
      a = G(d.stack), d.stack = a, c(d);
    }
  }
}
;const ma = require(u(process.argv[2])), {entry:U, js:V, destination:na} = ma;
let W, X = W;
try {
  W = A(U).toString();
} catch (a) {
  if ("ENOENT" != a.code) {
    throw a;
  }
  X = require.resolve(U);
  W = A(X).toString();
}
const oa = p(X), pa = p(V), [, Y] = W.split("/* typework */\n");
Y || (console.log("/* typework */ marker not found in %s", r("", X)), process.exit(1));
const qa = A(V).toString(), Z = /import\(['"](\..+?)['"]\)/g;
(async() => {
  let a = {};
  var b = new T({re:Z, async replacement(c, d) {
    let f = q(na, d);
    var e = r(pa, f);
    if (d in a) {
      return a[d];
    }
    e = `import('${e}')`;
    a[d] = e;
    console.log("Detected %s", d);
    const k = q(oa, d);
    try {
      ({path:h} = await M(k));
    } catch (m) {
      return console.log("Could not resolve %s from %s", d, X), c;
    }
    f.endsWith(".js") || (f = h.endsWith("index.js") ? q(f, "index.js") : f + ".js");
    c = await O(h);
    const l = p(h);
    var h = new T({re:Z, async replacement(m, g) {
      var n = q(l, g);
      ({path:n} = await M(n));
      var t = r(p(f), V);
      if (n == X) {
        return t = t.replace(/(\/index)?\.js$/, ""), `import('${t}')`;
      }
      t = p(f);
      g = q(t, g);
      g.endsWith(".js") || (g = n.endsWith("index.js") ? q(g, "index.js") : g + ".js");
      x(g) || (n = await O(n), await P(g, n));
      return m;
    }});
    h = await S(h, c);
    await ja(f);
    await P(f, h);
    return e;
  }});
  b = await S(b, Y);
  b = qa.replace(/\/\* typework \*\/\n(?:([^\n][\s\S]+?\n))?$/, `/* typework */
${b}`);
  await P(V, b);
})();

