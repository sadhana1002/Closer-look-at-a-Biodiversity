function loadsample(sample){
    var url = `/sample/${sample}`;
    Plotly.d3.json(url,function(error,response){
        if(error){ 
            return console.warn(error);
        }
        populateBackground(response['personal']);
        populatePieChart(response['otu_distribution'])
        console.log(response);
        
    });
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

Plotly.d3.json("/otu",function(error,response){
    if(error){ 
        return console.warn(error);
    }
    console.log("Bubble");
    console.log(response);

    var normalize = function(arr) {
                         var max = Math.max(...arr);
                         var min = Math.min(...arr);
                         var colors = arr.map(function(d){  
                                    return (d-min)/(max-min)*100;
                                    });

                         return colors;
                    }

    var colors = normalize(response["y"]);

    response["mode"] = "markers";

    response["marker"] = {
        size:10,
        color:colors.map(d=>Math.round((d*400),2))
    };


    console.log("Response");
    console.log(response);

    var data = [response];

    var layout = {
        title: 'Scatter Plot with a Color Dimension'
      };

    var bubbleDiv = document.querySelector(".otu-sample-bubble");  

    Plotly.plot(bubbleDiv,data);
    // ,layout);

});
