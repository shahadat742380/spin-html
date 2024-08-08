

var padding = {top:20, right:40, bottom:0, left:0},
            w = 400 - padding.left - padding.right,
            h = 400 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.ordinal().range(["#EF3A53", "#EF3A531A"]); 
            
        var data = [
                    {"label":"1000", "value":1,  "question":"100"}, 
                    {"label":"200",  "value":2,  "question":"200"}, 
                    {"label":"300",  "value":3,  "question":"400"}, 
                    {"label":"500",  "value":4,  "question":"500"},
                    {"label":"600",  "value":5,  "question":"600"}, 
                    {"label":"700",  "value":6,  "question":"700"}, 
                    {"label":"800",  "value":7,  "question":"800"}, 
                    {"label":"900",  "value":8,  "question":"900"},
                    {"label":"1000", "value":9,  "question":"1000"}, 
                    {"label":"400",  "value":10, "question":"400"}
        ];
        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        var vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        
        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");
        
        arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });
        
        // Label color
        var colors = ["#FFFFFF", "#22292F"]; 
        
        // add the text
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .text( function(d, i) {
                return data[i].label;
            }).style({
                "fill": function(d, i) {
                    return colors[i % colors.length];
                },
                "font-weight": "600",
                "font-size": "18px" ,
            });


        container.on("click", spin);
        function spin(d){
            
            container.on("click", null);
            //all slices have been seen, all done
            console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }
            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){
                    //mark question as seen
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")

                    // change select color
                        // .attr("fill", "red");

                    //populate question
                    d3.select("#question h1")
                        .text(data[picked].question);
                    oldrotation = rotation;
              
                    /* Get the result value from object "data" */
                    console.log(data[picked].value)
              
                    /* Comment the below line for restrict spin to sngle time */
                    container.on("click", spin);
                });
        }
        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"#EF3A53"});
        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 45)
            .style({"fill":"white","cursor":"pointer"});
        //spin text
        container.append("text")
            .attr("x", 0)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .text("Spin")
            .style({"font-weight":"700", "font-size":"25px"});
        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }
            return array;
        }