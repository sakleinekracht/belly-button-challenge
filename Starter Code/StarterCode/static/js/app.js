const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data, console log, and set up drop down
function init(){ 
    let selecter = d3.select("#selDataset")
d3.json(url).then(function(data) {
  console.log(data);
let sampleNames = data.names
for(let i = 0; i < sampleNames.length; i++) {
    selecter.append("option").text(sampleNames[i]).property("value", sampleNames[i])
}
buildCharts(sampleNames[0])
buildTable(sampleNames[0])
});}

init()


//function to update page data based on new sample selection
function optionChanged(newSample) {
    buildCharts(newSample)
    buildTable(newSample) 
}


//// //display sample metadata/ individual's demographic info
function buildTable(sample) {
    d3.json(url).then(function(data) {
        let meta = data.metadata
        let metaResult = meta.filter(obj => obj.id == sample)[0]
        console.log(metaResult.wfreq)
        let table = d3.select("#sample-metadata")
        table.html("")
        for(item in metaResult) {
            table.append("h6").text(`${item.toUpperCase()}: ${metaResult[item]}`)
        }
    })
}


//building bar and bubble charts
function buildCharts(sample) {
    d3.json(url).then(function(data) {
        let meta = data.metadata
        let metaResult = meta.filter(obj => obj.id == sample)[0]
        let wfreq = metaResult.wfreq

        //variables for graph 
        let samples = data.samples
        let samplesResult = samples.filter(obj => obj.id == sample)[0]
        console.log(samplesResult)
        let otu_ids = samplesResult.otu_ids
        let otu_labels = samplesResult.otu_labels
        let sample_values = samplesResult.sample_values
        let y_vals = otu_ids.slice(0,10).map(otu => `OTU ${otu}`).reverse()

    //create horizontal bar chart with drop down menu to display top 10 OTUs found in individual

    let barData = [{
        type: 'bar',
        x: sample_values.slice(0,10).reverse(), 
        y: y_vals,
        text: otu_labels.slice(0,10).reverse(),
        orientation: 'h'
    }];
    
    let barLayout = {
        title: "Top 10 Bacteria Cultures Found"
    }

    Plotly.newPlot('bar', barData, barLayout);

    // //create a bubble chart that displays each sample

    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels, 
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Blues'
        }
    };
    
    let bubbleData = [trace1];
    
    let bubbleLayout = {
        title: 'All Bacteria Cultures Found',
        showlegend: false,
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    let gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wfreq,
          title: { text: "Belly Button Washing Frequency", font: { size: 20 } },
          gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "black" },
            bar: { color: "red" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "white" },
              { range: [1, 2], color: "orange" },
              { range: [2, 3], color: "lightyellow" },
              { range: [3, 4], color: "yellow" },
              { range: [4, 5], color: "lightgreen" },
              { range: [5, 6], color: "green" },
              { range: [6, 7], color: "lightblue" },
              { range: [7, 8], color: "blue" },
              { range: [8, 9], color: "purple" },
            ],
            
          }
        }
      ];
      
      let gaugeLayout = {
        margin: { t: 25, r: 25, l: 25, b: 25 },
        font: { color: "black", family: "Arial" }
      };
      
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
      
    })
}









