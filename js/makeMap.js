/**
 * Created by ptr_bodnar on 26.07.18.
 */

function createMap(data, branch, planted) {
    d3.selectAll(".leaflet-interactive").remove();
    d3.selectAll(".leaflet-control-layers-toggle").remove();



    function nested_geojson(data) {

        window.result_list = [];

        function makeObjectCopy(n, obj) {
            for (var i = 0; i < n; i++) {
                result_list.push(JSON.parse(JSON.stringify(obj)));
            }
        }


        data.forEach(function(d) {
            // if (+d.number <= 1) {
            //     result_list.push(d)
            // }
            // else {
                makeObjectCopy(+d.number, d);
            // }
        });

        result_list.forEach(function (obj) {



            if (obj.number > 1) {
                obj["LatLon13"] = [+obj.Longitude + (getRandomArbitrary(-0.003,0.003)),
                    +obj.Latitude + (getRandomArbitrary(-0.003,0.003))];

                obj["LatLon14"] = [+obj.Longitude + (getRandomArbitrary(-0.0025,0.0025)),
                    +obj.Latitude + (getRandomArbitrary(-0.0025,0.0025))];

                obj["LatLon15"] = [+obj.Longitude + (getRandomArbitrary(-0.002,0.002)),
                    +obj.Latitude + (getRandomArbitrary(-0.002,0.002))];

                obj["LatLon16"] = [+obj.Longitude + (getRandomArbitrary(-0.0015,0.0015)),
                    +obj.Latitude + (getRandomArbitrary(-0.0015,0.0015))];

                obj["LatLon17"] = [+obj.Longitude + (getRandomArbitrary(-0.001,0.001)),
                    +obj.Latitude + (getRandomArbitrary(-0.001,0.001))];

                obj["LatLon18"] = [+obj.Longitude + (getRandomArbitrary(-0.0005,0.0005)),
                    +obj.Latitude + (getRandomArbitrary(-0.0005,0.0005))];

                obj.Longitude = +obj.Longitude + (getRandomArbitrary(-0.003,0.003));
                obj.Latitude = +obj.Latitude + (getRandomArbitrary(-0.003,0.003));
            }
            else {
                obj
            }
        });


        var geojson = result_list.map(function (d) {
            return {
                type: "Feature",
                properties: d,
                geometry: {
                    type: "Point",
                    coordinates: [+d.Longitude, +d.Latitude]
                }
            }
        });
        console.log(geojson);


        return geojson

    }

    geojsonLayer = L.geoJson(nested_geojson(data), {
        style: function (feature) {
            return styleForLayer(feature)
        },
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 4, fillOpacity: 0.75});
        }
    });


    geojsonLayerBranch = L.geoJson(nested_geojson(branch), {
        style: function (feature) {
            return styleForLayer(feature);
        },
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 4, fillOpacity: 0.5});
        }
    });


    geojsonLayerPlanted = L.geoJson(nested_geojson(planted), {
        style: function (feature) {
            return styleForLayer(feature);
        },
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 4, fillOpacity: 0.5});
        }
    });

    mymap.addLayer(geojsonLayer);
    
    overlayMaps = {
        "Зрубування дерев": geojsonLayer,
        "Обрізання дерев": geojsonLayerBranch,
        "Висадження нових дерев": geojsonLayerPlanted
    };

    L.control.layers(overlayMaps,null,{collapsed:false}).addTo(mymap);


    geojsonLayer.on("click", function (d) {

        d3.select("div.mystyle").style("display", "flex");
        d3.selectAll(".mystyle *").remove();

        d3.select(".mystyle").append("h3").text(
            "Інформація про дерево: "
        );


        d3.select(".mystyle").append("p").attr("class", "total").text(
            "Адреса: " + d.layer.feature.properties.tree_adress_shorten);

        d3.select(".mystyle").append("p").attr("class", "act").text(
            "Номер акту: " + d.layer.feature.properties.act_number);

        d3.select(".mystyle").append("p").attr("class", "order").text(
            "Ім'я/Назва замовника: " + d.layer.feature.properties.name_who_ordered);

        d3.select(".mystyle").append("p")
            .attr("id", d.layer.feature.properties.tree_characteristics)
            .attr("class", "tree")
            .text("Вид дерева: " + d.layer.feature.properties.tree_characteristics)
            .on('mouseover', function () {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                })
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                })
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                })
            })
            .on('mouseout', function () {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
            });

        var element = d3.select(".mystyle")
            .selectAll(".element")
            .data(d.layer.feature.properties)
            .enter()
            .append("div")
            .attr("class", "element");
    });


    mymap.on('baselayerchange', function (e) {
        addPopUp(e);
        d3.selectAll("#title *").remove();
        if (e.name == 'Зрубування дерев') {


            d3.select("div.mystyle").style("display", "none");
            d3.selectAll(".mystyle *").remove();
            createBar(data);
        }
        if (e.name == 'Обрізання дерев') {


            d3.select("div.mystyle").style("display", "none");
            d3.selectAll(".mystyle *").remove();
            createBar(branch);
        }
        if (e.name == 'Висадження нових дерев') {


            d3.select("div.mystyle").style("display", "none");
            d3.selectAll(".mystyle *").remove();
            createBar(planted);
        }

    });


    // add Treeline legend 1
    var legend1 = L.control({position: 'topright'});

    legend1.onAdd = function (mymap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["#c90737", "#c95107"],
            labels = ["Зрубані дерева","Дерева які ще зрубають"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
        }

        return div;
    };

    legend1.addTo(mymap);


    // add  legend 2
    var legend2 = L.control({position: 'topright'});
    legend2.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["#c90737", "#c95107"],
            labels = ["Обрізали гілки","Ще не обрізали"];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
        }
        return div;
    };

    // add  legend 3
    var legend3 = L.control({position: 'topright'});
    legend3.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ["#99bb06"],
            labels = ["Висаджені дерева"];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<span class="dot" style="background:' + grades[i] + '"></span> ' + " " + labels[i] +'<br>';
        }
        return div;
    };

    mymap.on('baselayerchange', function (eventLayer) {
        // Switch to the Permafrost legend...
        if (eventLayer.name === 'Зрубування дерев') {
            this.removeControl(legend2);
            this.removeControl(legend3);
            legend1.addTo(this);
        }
        if (eventLayer.name === 'Обрізання дерев') {
            geojsonLayerBranch.setStyle(function (feature) {
                if (feature.properties.was_cut == 'true') {
                    return {fillColor: "#c90737", color: "rgba(0, 0, 0, 0);"};
                }
                else {
                    return {fillColor: "#c95107", color: "rgba(0, 0, 0, 0);"} ;
                }
            });
            this.removeControl(legend1);
            this.removeControl(legend3);
            legend2.addTo(this);
        }
        if (eventLayer.name === 'Висадження нових дерев') {
            geojsonLayerPlanted.setStyle(function (feature) {
                if (feature.properties.was_cut == 'true') {
                    return {fillColor: "#99bb06", color: "rgba(0, 0, 0, 0);"};
                }
                else {
                    return {fillColor: "#99bb06", color: "rgba(0, 0, 0, 0);"} ;
                }
            });
            this.removeControl(legend1);
            this.removeControl(legend2);
            legend3.addTo(this);
        }
    });


    // Тут я працюю над тим, щоб координати змінювались разом із зумом
    mymap.on('zoomend', function () {
        //var currZoom = mymap.getZoom();

        geojsonLayer.eachLayer(function(layer){
            var currZoom = mymap.getZoom();
            if (+layer.feature.properties.number > 1) {
                layer.setLatLng({
                    lat: +layer.feature.properties['LatLon' + currZoom][1],
                    lng: +layer.feature.properties['LatLon' + currZoom][0]
                }).redraw();
            }
        });

        geojsonLayerBranch.eachLayer(function(layer){
            var currZoom = mymap.getZoom();
            if (+layer.feature.properties.number > 1) {
                layer.setLatLng({
                    lat: +layer.feature.properties['LatLon' + currZoom][1],
                    lng: +layer.feature.properties['LatLon' + currZoom][0]
                }).redraw();
            }
        });


        geojsonLayerPlanted.eachLayer(function(layer){
            var currZoom = mymap.getZoom();
            if (+layer.feature.properties.number > 1) {
                layer.setLatLng({
                    lat: +layer.feature.properties['LatLon' + currZoom][1],
                    lng: +layer.feature.properties['LatLon' + currZoom][0]
                }).redraw();
            }
        });
    });

}

