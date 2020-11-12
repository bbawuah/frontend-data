var PaymentMethods;
(function (PaymentMethods) {
    PaymentMethods["VPAY"] = "VPAY";
    PaymentMethods["CREDITCARD"] = "CREDITCARD";
    PaymentMethods["CASH"] = "CASH";
    PaymentMethods["MAESTRO"] = "MAESTRO";
    PaymentMethods["PIN"] = "PIN";
    PaymentMethods["CHIPKNIP"] = "CHIPKNIP";
    PaymentMethods["COINS"] = "COINS";
    PaymentMethods["BETAALAUTOMAAT"] = "BETAALAUTOMAAT";
    PaymentMethods["POS"] = "POS";
    PaymentMethods["CHIP"] = "CHIP";
    PaymentMethods["BELPARKEREN"] = "BELPARKEREN";
    PaymentMethods["BANKNOTES"] = "BANKNOTES";
    PaymentMethods["MASTERCARD"] = "MASTERCARD";
    PaymentMethods["VISA"] = "VISA";
    PaymentMethods["MOBIEL"] = "MOBIEL";
    PaymentMethods["AMEX"] = "AMEX";
    PaymentMethods["DIP_TAP_GO"] = "DIP-TAP&GO";
    PaymentMethods["DIP_GO"] = "DIP-GO";
    PaymentMethods["XXIMIO"] = "XXIMIO";
    PaymentMethods["DINERS_CLUB"] = "DINERS-CLUB";
})(PaymentMethods || (PaymentMethods = {}));
var AreaManagerID;
(function (AreaManagerID) {
    AreaManagerID["AM1"] = "299";
    AreaManagerID["AM2"] = "518";
    AreaManagerID["AM3"] = "677";
    AreaManagerID["AM4"] = "243";
    AreaManagerID["AM5"] = "243";
    AreaManagerID["AM6"] = "402";
    AreaManagerID["AM7"] = "642";
    AreaManagerID["AM8"] = "202";
    AreaManagerID["AM9"] = "439";
    AreaManagerID["AM10"] = "546";
    AreaManagerID["AM11"] = "715";
    AreaManagerID["AM12"] = "867";
    AreaManagerID["AM13"] = "363";
    AreaManagerID["AM14"] = "384";
    AreaManagerID["AM15"] = "307";
    AreaManagerID["AM16"] = "361";
    AreaManagerID["AM17"] = "935";
    AreaManagerID["AM18"] = "1900";
    AreaManagerID["AM19"] = "855";
    AreaManagerID["AM20"] = "203";
    AreaManagerID["AM21"] = "106";
    AreaManagerID["AM22"] = "777";
    AreaManagerID["AM23"] = "118";
    AreaManagerID["AM24"] = "281";
    AreaManagerID["AM25"] = "150";
    AreaManagerID["AM26"] = "344";
    AreaManagerID["AM27"] = "599";
    AreaManagerID["AM28"] = "858";
    AreaManagerID["AM29"] = "153";
    AreaManagerID["AM30"] = "606";
    AreaManagerID["AM31"] = "1942";
    AreaManagerID["AM32"] = "1949";
    AreaManagerID["AM33"] = "664";
    AreaManagerID["AM34"] = "826";
})(AreaManagerID || (AreaManagerID = {}));
(async () => {
    const paymentMethodsResponse = await fetch("https://opendata.rdw.nl/resource/r3rs-ibz5.json");
    const paymentMethodsJson = await paymentMethodsResponse.json();
    const paymentMethods = Object.values(PaymentMethods);
    const paymentData = paymentMethods.map((payment) => {
        const paymentMethodAreas = paymentMethodsJson.filter((item) => item.paymentmethod.toUpperCase() === payment);
        return {
            paymentMethodTitle: payment,
            areas: paymentMethodAreas,
        };
    });
    renderD3(paymentData);
    const GEOres = await fetch("https://cartomap.github.io/nl/wgs84/provincie_2020.topojson");
    const GEOjson = await GEOres.json();
    const bbox = [11.825, 53.7253321, -68.6255319, 7.2274985];
    GEOjson.bbox = bbox;
    const sellingPointsResponse = await fetch("https://opendata.rdw.nl/resource/cgqw-pfbp.json");
    const sellingPointsJson = await sellingPointsResponse.json();
    const areas = Object.values(AreaManagerID);
    const formattedArraySellingPoints = areas.map((area) => {
        const paymentMethodAreas = sellingPointsJson.filter((item) => item.areamanagerid === area);
        return {
            area: area,
            areas: paymentMethodAreas,
        };
    });
    renderGEO(GEOjson, formattedArraySellingPoints, paymentData);
})();
function renderD3(parkingData) {
    const margin = { top: 20, right: 20, bottom: 30, left: 110 }, width = 700 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
    // set the ranges
    const y = d3.scaleBand().range([height, 0]).padding(0.1);
    const x = d3.scaleLinear().domain([0, 300]).range([0, width]);
    const svg = d3
        .select("svg")
        .classed("container", true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // format the data
    parkingData.forEach((data) => {
        data.areas.length = +data.areas.length;
    });
    // Scale the range of the data in the domains
    x.domain([0, d3.max(parkingData, (data) => data.areas.length)]);
    y.domain(parkingData.map((data) => data.paymentMethodTitle));
    // append the rectangles for the bar chart
    svg
        .selectAll(".bar")
        .data(parkingData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", (data) => x(data.areas.length))
        .attr("y", (data) => y(data.paymentMethodTitle))
        .attr("height", y.bandwidth());
    // x Axis
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // y Axis
    svg.append("g").call(d3.axisLeft(y));
}
function getPaymentMethods(json) {
    const array = json.map((item) => {
        return item.paymentmethod.toUpperCase();
    });
    return new Set(array);
}
function renderGEO(data, sellingPoints, paymentData) {
    const path = d3.geoPath();
    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
    const radiusScale = d3.scaleSqrt();
    const width = 975;
    const height = 610;
    const svg = d3.select(".geo-chart").classed("geo", true).on("click", reset);
    const g = svg.append("g");
    const projection = d3.geoMercator().scale(6000).center([5.116667, 52.17]);
    const pathGenerator = path.projection(projection);
    radiusScale.domain([0, 400]).range([0, 10]);
    const tooltip = d3
        .select(".map-container")
        .append("div")
        .attr("class", "hidden tooltip");
    const provincies = g
        .append("g")
        .attr("fill", "#8d99ae")
        .attr("cursor", "pointer")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.provincie_2020).features)
        .join("path")
        .attr("d", path)
        .on("click", clicked);
    // Add circles:
    g.selectAll("myCircles")
        .data(sellingPoints)
        .enter()
        .append("circle")
        .attr("cx", (data) => {
        return projection([
            parseFloat(data.areas[0].location.longitude),
            parseFloat(data.areas[0].location.latitude),
        ])[0];
    })
        .attr("cy", function (data) {
        return projection([
            parseFloat(data.areas[0].location.longitude),
            parseFloat(data.areas[0].location.latitude),
        ])[1];
    })
        .attr("r", (data) => {
        return radiusScale(data.areas.length);
    })
        .style("fill", "#fff")
        .attr("stroke-width", 3)
        .attr("fill-opacity", 0.4)
        .attr("cursor", "pointer")
        .on("mousemove", mouseMove)
        .on("mouseout", mouseOut);
    svg.call(zoom);
    function mouseMove(event, data) {
        d3.select(this).style("fill", "black");
        console.log(data);
        console.log(paymentData);
        const rawPaymentArray = paymentData.map((pData) => {
            const filter = pData.areas.filter((area) => area.areamanagerid === data.area);
            const methods = filter.map((d) => d.paymentmethod);
            return Array.from(new Set(methods));
        });
        const cleanPaymentArray = rawPaymentArray.filter((d) => d.length !== 0);
        console.log(cleanPaymentArray);
        console.log("mouse over");
        tooltip
            .classed("hidden", false)
            .attr("style", "left:" +
            (() => event.clientX + 20) +
            "px; top:" +
            (() => event.clientX + 20) +
            "px").html(`
      Aantal verkooppunten: ${data.areas.length}\n
      Bekende betalingsmethodes: ${cleanPaymentArray.map((d) => ` ${d}`)}
      `);
    }
    function mouseOut() {
        d3.select(this).style("fill", "#fff");
        console.log("mouse out");
        tooltip.classed("hidden", true);
    }
    function reset() {
        provincies.transition().style("fill", null);
        svg
            .transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svg.node()).invert([width / 2, height / 2]));
    }
    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        provincies.transition().style("fill", null);
        d3.select(this).transition().style("fill", "red");
        svg
            .transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2), d3.pointer(event, svg.node()));
    }
    function zoomed(event) {
        const { transform } = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }
}
//# sourceMappingURL=index.js.map