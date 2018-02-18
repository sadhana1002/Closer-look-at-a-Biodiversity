function loadsample(sample){
    var url = `/sample/${sample}`;
    Plotly.d3.json(url,function(error,response){
        if(error){ 
            return console.warn(error);
        }
        populateBackground(response['personal']);
        populatePieChart(response['otu_distribution'])
        populateBubbleChart(response['otu_sample']);
        populateGauge(response['washing_frequency']);
        console.log(response);
    });
}

function populateBubbleChart(otu_sample_data){
    console.log("tryyyyyyyyyyyyyyyyyyy");
    console.log(otu_sample_data);

    otu_sample_data['mode'] = 'markers';
    otu_sample_data['marker'] = {
          size: otu_sample_data['y'].map(d=>Math.min(d*10,60)),
          color: otu_sample_data['y'].map(d=>100+d*20)
                }
      
      var data = [{
        'y':otu_sample_data['y'],
        'mode':'markers',
        'marker':{
            size: otu_sample_data['y'].map(d=>d),
            color: otu_sample_data['y'].map(d=>100+d*20)
                  }
      }];
      
      var layout = {
        title: 'Scatter Plot with a Color Dimension',
        xaxis: {
            // range: [ 0, 4000 ],
            title: "OTUs"
          },
          yaxis: {
            // range: [-100, 1000],
            title: "Intensity found in sample"
          },
      };

      var bubbleDiv = document.querySelector('.otu-sample-bubble');
      
      Plotly.newPlot(bubbleDiv, data, layout);
      


}


function populatePieChart(sample_otu_distribution){
    console.log("Pie chart data");
    sample_otu_distribution["type"] = "pie";
    console.log(sample_otu_distribution);

    var pieDiv = document.querySelector(".germs-pie")

    var data = [sample_otu_distribution];
    var layout = {
        height: 400,
        width: 500,
        title: "Top 10 Operational Taxonomic Units <br> (OTU) found in this sample"
      };
      
    Plotly.newPlot(pieDiv,data,layout);


}

function populateBackground(personal_data){
    
    console.log(personal_data);

    var table = Plotly.d3.select("#personal-background");
    var tbody = table.select("tbody");

    var data_list = []

    for(var key in personal_data){
        var item = [key,personal_data[key]];
        data_list.push(item);
    }

    var rows = tbody.selectAll('tr')
    .data(data_list)
    .enter()
    .append('tr')
    .html(function(d){
        return `<td>${d[0]}</td><td>${d[1]}</td>`
    })
}

function populateGauge(num){
    if(!num){
        num = 1;
    }
            var level = num*18;
            // Trig to calc meter point
            var degrees = level,
                radius = .9;
            var radians = degrees * Math.PI / 180;
            var x = radius * Math.cos(radians);
            var y = radius * Math.sin(radians);
    
            // Path: may have to change to create a better triangle
            var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                pathX = String(x),
                space = ' ',
                pathY = String(y),
                pathEnd = ' Z';
            var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
            var data = [{ type: 'scatter',
            x: [0], y:[0],
                marker: {size: 10, color:'850000'},
                showlegend: false,
                name: 'speed',
                text: level,
                hoverinfo: 'text+name'},
            { values: [50/5, 50/5, 50/5, 50/5, 50/5, 50],
            rotation: 90,
            text: ['0-2','3-4','5-6','7-8','9-10', ''],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:['rgba(210, 206, 145, .5)','rgba(202, 209, 95, .5)','rgba(170, 202, 42, .5)', 'rgba(110, 154, 22, .5)',
                                            'rgba(14, 127, 0, .5)', 'rgba(255, 255, 255, 0)']},
            labels:['1-2','3-4','5-6','7-8','9-10', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
            }];
    
            var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
                }],
            title: 'Washing Frequency (0-10) per week',
            height: 500,
            width: 500,
            xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]}
            };
    
            var gauge = document.querySelector('.washing-frequency');
            Plotly.newPlot(gauge, data, layout);    
}


Plotly.d3.json("/names",function(error,response){
    if(error){ 
        return console.warn(error);
    }

    console.log(response);

    Plotly.d3.select("#sample-select").append("option")
    .attr("selected","true")
    .attr("disabled","true")
    .text("Select a sample");  

    var names = Plotly.d3.select("#sample-select").selectAll("option").data(response);
    names.enter()
          .append("option")
          .attr("value",d => d)
          .text(d => d);
    
    Plotly.d3.select("#sample-select").on('change',function(){
            var newData = this.options[this.selectedIndex].value;
            loadsample(newData);
          });
});
