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
(async () => {
    const res = await fetch("https://opendata.rdw.nl/resource/r3rs-ibz5.json");
    const json = await res.json();
    const paymentMethods = Object.values(PaymentMethods);
    const formattedArray = paymentMethods.map((payment) => {
        const paymentMethodAreas = json.filter((item) => item.paymentmethod.toUpperCase() === payment);
        return {
            paymentMethodTitle: payment,
            areas: paymentMethodAreas,
        };
    });
    console.log(formattedArray);
    renderD3(formattedArray);
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
//# sourceMappingURL=index.js.map