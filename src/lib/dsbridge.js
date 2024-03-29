var bridge = {
  default: this,
  call: function(b, a, c) {
    "function" == typeof a && ((c = a), (a = {}));
    a = { data: a || {} };
    if ("function" == typeof c) {
      var e = "dscb" + window.dscb++;
      window[e] = c;
      a._dscbstub = e;
    }
    a = JSON.stringify(a);
    b = window._dsbridge ? _dsbridge.call(b, a) : "0";
    return JSON.parse(b).data;
  },
  register: function(b, a, c) {
    c = c ? window._dsaf : window._dsf;
    window._dsInit ||
      ((window._dsInit = !0),
      setTimeout(function() {
        bridge.call("_dsb.dsinit");
      }, 0));
    "object" == typeof a ? (c._obs[b] = a) : (c[b] = a);
  },
  registerAsyn: function(b, a) {
    this.register(b, a, !0);
  },
  hasNativeMethod: function(b, a) {
    return this.call("_dsb.hasNativeMethod", { name: b, type: a || "all" });
  },
  disableJavascriptDialogBlock: function(b) {
    this.call("_dsb.disableJavascriptDialogBlock", { disable: !1 !== b });
  }
};

!(function() {
  if (!window._dsf) {
    var b = {
        _dsf: { _obs: {} },
        _dsaf: { _obs: {} },
        dscb: 0,
        dsBridge: bridge,
        close: function() {
          bridge.call("_dsb.closePage");
        },
        _handleMessageFromNative: function(a) {
          var e = JSON.parse(a.data),
            b = { id: a.callbackId, complete: !0 },
            c = this._dsf[a.method],
            d = this._dsaf[a.method],
            g = function(a, c) {
              b.data = a.apply(c, e);
              bridge.call("_dsb.returnValue", b);
            },
            h = function(a, c) {
              e.push(function(a, c) {
                b.data = a;
                b.complete = !1 !== c;
                bridge.call("_dsb.returnValue", b);
              });
              a.apply(c, e);
            };
          if (c) g(c, this._dsf);
          else if (d) h(d, this._dsaf);
          else if (((c = a.method.split(".")), !(2 > c.length))) {
            a = c.pop();
            var c = c.join("."),
              d = this._dsf._obs,
              d = d[c] || {},
              f = d[a];
            f && "function" == typeof f
              ? g(f, d)
              : ((d = this._dsaf._obs),
                (d = d[c] || {}),
                (f = d[a]) && "function" == typeof f && h(f, d));
          }
        }
      },
      a;
    for (a in b) window[a] = b[a];
    bridge.register("_hasJavascriptMethod", function(a, b) {
      b = a.split(".");
      if (2 > b.length) return !(!_dsf[b] && !_dsaf[b]);
      a = b.pop();
      b = b.join(".");
      return (b = _dsf._obs[b] || _dsaf._obs[b]) && !!b[a];
    });
  }
})();



 