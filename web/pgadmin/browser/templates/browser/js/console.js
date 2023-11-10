window.hookConsole = function (callback) {
  for (const method of ["log", "error"]) {
    const nativeMethod = window.console[method];
    window.console[method] = function () {
      nativeMethod.apply(this, arguments);
      setTimeout(() => {
        callback(method, arguments);
      });
    };
  }
};
try {
  require([
    "sources/generated/app.bundle",
    "sources/generated/codemirror",
    "sources/generated/browser_nodes",
  ], function () {}, function () {
    /* TODO:: Show proper error dialog */
    console.log(arguments);
  });
} catch (err) {
  /* Show proper error dialog */
  console.log(err);
}
/*
 * Show loading spinner till every js module is loaded completely
 * Referenced url:
 * http://stackoverflow.com/questions/15581563/requirejs-load-script-progress
 * Little bit tweaked as per need
 */
require.onResourceLoad = function (context, map, depMaps) {
  var loadingStatusEl = (panel = document.getElementById("pg-spinner"));
  if (loadingStatusEl) {
    if (!context) {
      // we will call onResourceLoad(false) by ourselves when requirejs
      // is not loading anything d-none the indicator and exit
      setTimeout(function () {
        if (panel != null) {
          try {
            $(panel).remove();
          } catch (e) {
            panel.outerHTML = "";
            delete panel;
          }
          return;
        }
      }, 500);
    }

    // show indicator when any module is loaded and
    // shedule requirejs status (loading/idle) check
    panel.style.display = "";
    clearTimeout(panel.ttimer);
    panel.ttimer = setTimeout(function () {
      var context = require.s.contexts._;
      var inited = true;
      for (name in context.registry) {
        var m = context.registry[name];
        if (m.inited !== true) {
          inited = false;
          break;
        }
      }

      // here the "inited" variable will be true, if requirejs is "idle",
      // false if "loading"
      if (inited) {
        // will fire if module loads in 400ms. TODO: reset this timer
        // for slow module loading
        require.onResourceLoad(false);
      }
    }, 400);
  }
};
