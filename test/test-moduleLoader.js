var Core = require("../lib/core.js"),
    moduleLoader = require("../modules/moduleLoader.js"),
    path = require("path"),
    assert = require("assert");

var dummyPath = path.join(__dirname, "dummy");

suite("module loader", function () {
    var Core;

    setup(function () {
        Core = instance();
        Core.module("moduleLoader", moduleLoader);
    });

    teardown(function () {
        Core.emit("destroy");
        Core.purge();
    });

    test("module loader loads dummy", function (done) {
        Core.on('moduleLoader.loaded', handleLoad);
        Core.invoke("moduleLoader.load", dummyPath);
        
        function handleLoad(module, uri) {
            assert(module.attach, "is not a module");
            assert.equal(uri, path.join(dummyPath, "temp.js"), 
                "uri is not the correct path");
            done();
        }
    });

    test("module loader auto load", function (done) {
        Core.on("moduleLoader.attached", handleAttached);
        Core.invoke("moduleLoader.autoload", dummyPath, callback);

        function handleAttached(module) {
            assert(module.attach, "module is not a module");
            assert(Core.attached, "module was not attached");
        }

        function callback() {
            assert(Core.attached, "module was not attached");
            done();
        }
    });

    test("module loader works recursively", function (done) {
        var uri = path.join(__dirname, 'recursive');

        Core.on('moduleLoader.attached', handleAttached);
        Core.invoke("moduleLoader.autoload", uri);

        function handleAttached(module) {
            assert(module.attach, "module is not a module");
            assert(Core.attached, "module was not attached");
            done();
        }
    });

    test("detaches cleanly", function () {
        Core.remove("moduleLoader");
        assert.equal(0, Core._events['moduleLoader.load'].length,
            "events did not remove cleanly");
    });
});

function instance() {
    return Object.create(Core).constructor();
}