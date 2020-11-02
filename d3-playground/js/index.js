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
    PaymentMethods["DIP_GO"] = "DIP_GO";
    PaymentMethods["XXIMIO"] = "XXIMIO";
    PaymentMethods["DINERS_CLUB"] = "DINERS_CLUB";
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
    renderD3(formattedArray);
})();
function renderD3(parkingData) {
    const xScale = d3
        .scaleBand()
        .domain(parkingData.map((data) => data.paymentMethodTitle))
        .rangeRound([0, 700])
        .padding(0.1);
    const yScale = d3.scaleLinear().domain([0, 260]).range([200, 0]);
    const container = d3
        .select("svg")
        .classed("container", true)
        .style("border", "1px solid green");
    // Bars
    container
        .selectAll(".bar")
        .data(parkingData)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", xScale.bandwidth())
        .attr("height", (data) => 200 - yScale(data.areas.length))
        .attr("x", (data) => xScale(data.paymentMethodTitle))
        .attr("y", (data) => yScale(data.areas.length));
}
function getPaymentMethods(json) {
    const array = json.map((item) => {
        return item.paymentmethod.toUpperCase();
    });
    return new Set(array);
}
//# sourceMappingURL=index.js.map