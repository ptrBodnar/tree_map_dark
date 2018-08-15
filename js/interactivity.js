function addPopUp(e) {

    e.layer.on("click", function (d) {
        d3.select("div.mystyle").style("display", "flex");
        d3.selectAll(".mystyle *").remove();

        d3.select(".mystyle").append("h3").text(
            "Інформація про дерево: "
        );

        d3.select(".mystyle").append("p").attr("class", "total").text(
            "Адреса: " + d.layer.feature.properties.tree_adress_shorten);

        d3.select(".mystyle")
            .append("p")
            .attr("class", "tree")
            .attr("id", d.layer.feature.properties.tree_characteristics)
            .text("Вид дерева: " + d.layer.feature.properties.tree_characteristics)
            .on('mouseover', function (d) {
                var sel = this.id;
                geojsonLayer.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                });
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.1"};
                    }
                });
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
                });
                geojsonLayerBranch.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                });
                geojsonLayerPlanted.setStyle(function (d) {
                    if (!(d.properties.tree_characteristics == sel)) {
                        return {fillOpacity: "0.75"};
                    }
                })
            });

    });
}


