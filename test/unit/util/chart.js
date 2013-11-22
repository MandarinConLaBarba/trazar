var lib = function(m) {
    return require(__dirname + "/../../../lib/" + m);
};

var chart = lib("util/chart"),
    canvasFactory = lib("util/canvasFactory"),
    nchartFactory = lib("util/nchartFactory"),
    promisified = lib("util/promisified"),
    _ = require('underscore'),
    should = require('should'),
    sinon = require('sinon');


describe("util/chart", function(){

    var stubs = {},
        nchartStub,
        toBufferAsyncResult,
        canvasStub,
        canvasContext = {};

    beforeEach(function() {

        var getContextStub = sinon.stub(),
            toBufferAsyncStub = sinon.stub();
        getContextStub.returns(canvasContext);

        toBufferAsyncResult = {
            then : sinon.stub()
        };

        toBufferAsyncStub.returns(toBufferAsyncResult);

        nchartStub = {
            bar : sinon.stub(),
            line : sinon.stub(),
            pie : sinon.stub()
        };

        stubs.createNChart = sinon.stub(nchartFactory, "create");
        stubs.createNChart.returns(nchartStub);

        stubs.createCanvas = sinon.stub(canvasFactory, "create");
        canvasStub = {
            getContext : getContextStub,
            toBufferAsync : toBufferAsyncStub
        };
        stubs.createCanvas.returns(canvasStub);

        stubs.writeFile = sinon.stub(promisified, "writeFile");

    });

    afterEach(function() {

        _.invoke(stubs, "restore");

    });

    describe("render", function(){

        var args = {},
            result;

        describe("in general", function(){

            beforeEach(function() {
                args.type = "bar";
                args.outFile = "some/path/to/a/file";
                args.data = "some data";
                args.options = { width : 100, height : 100};
                result = chart.render(args.type, args.outFile, args.data, args.options);
            });

            it("should create a canvas", function(){

                canvasFactory.create.called
                    .should.be.true;

            });

            it("get the context from the canvas", function(){

                canvasStub.getContext.called
                    .should.be.true;

            });

            it("should get a 2d context from the canvas", function(){

                canvasStub.getContext.firstCall.args[0]
                    .should.equal('2d');

            });

            it("should create an nchart instance", function(){


                nchartFactory.create.called
                    .should.be.true;

            });

            it("should call the correct chart function", function(){

                nchartStub[args.type].called
                    .should.be.true;

            });

            it("should pass the data to the chart function", function(){

                nchartStub[args.type].firstCall.args[0]
                    .should.equal(args.data);

            });

            it("should pass the options to the chart function", function(){

                nchartStub[args.type].firstCall.args[1]
                    .should.equal(args.options);

            });

            it("should convert the canvas to a buffer", function(){

                canvasStub.toBufferAsync.called
                    .should.be.true;

            });

        });



    });

});