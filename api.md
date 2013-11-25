

<!-- Start lib/trazar.js -->

## ChartFactory(the, a, configuration)

ChartFactory constructor

### Params: 

* **provider** *the* chart provider to use. i.e. &#39;xunit&#39;, &#39;json&#39;

* **sources** *a* path to a directory, or an array of file paths

* **options** *configuration* options, extends chart.js options

## chart(type, path)

Generate the chart image

### Params: 

* **type** *type* of chart, i.e. &#39;line&#39;, &#39;bar&#39;

* **outFile** *path* to output file

## from(the, a, configuration)

Prepares a chart factory

### Example

 ```
 var promise = trazar
   .from("json", "path/to/mocha/json/output")
   .chart("line";, "path/to/chart.png");
 ```

### Example with options

 ```
 var promise = trazar
   .from("json", "path/to/mocha/json/output", {
     limit : 5,
     scaleLineWidth : 2,
     pointDotRadius : 4
   })
   .chart("line", "path/to/chart.png");
 ```

### Available options

#### Common options

* limit : Number (number of files to process in a directory)
* sortBy : String (method for sorting files on a graph. "filename"|"timestamp")
* sourceFilter : String (a string to match files in a directory for processing, i.e. &#39;.xml&#39; will only process files w/ &#39;.xml&#39; in the name)
* successFillColor : String (hex|rgba, i.e. &#39;#000000&#39;, &#39;rgba(0,0,0,.1)&#39;
* successStrokeColor : String (hex|rgba)
* failureFillColor : String (hex|rgba)
* failureStrokeColor : String (hex|rgba)

#### Line Graph Options

* successPointColor : String (hex|rgba)
* successPointStrokeColor : String (hex|rgba)
* failurePointColor : String (hex|rgba)
* failurePointStrokeColor : String (hex|rgba)
* any option from http://www.chartjs.org/docs/#lineChart-chartOptions, but note that animation options are not relevant and will have no effect

#### Bar Graph Options

* any option from http://www.chartjs.org/docs/#barChart-chartOptions, but note that animation options are not relevant and will have no effect

### Params: 

* **provider** *the* chart provider to use. i.e. &#39;xunit&#39;, &#39;json&#39;

* **sources** *a* path to a directory, or an array of file paths

* **options** *configuration* options, extends chart.js options

<!-- End lib/trazar.js -->

