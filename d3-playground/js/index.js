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
    const yScale = d3
        .scaleBand()
        .domain(parkingData.map((data) => data.paymentMethodTitle))
        .rangeRound([0, 500])
        .padding(0.1);
    const xScale = d3.scaleLinear().domain([0, 300]).range([0, 700]);
    const container = d3.select("svg").classed("container", true);
    // Bars
    container
        .selectAll(".bar")
        .data(parkingData)
        .enter()
        .append("rect")
        .text((data) => data.paymentMethodTitle)
        .classed("bar", true)
        .attr("width", (data) => xScale(data.areas.length))
        .attr("height", yScale.bandwidth())
        .attr("x", (data) => 700 - xScale(data.areas.length))
        .attr("y", (data) => yScale(data.paymentMethodTitle));
    container
        .append("g")
        .attr("transform", "translate(110,0)")
        .call(d3.axisLeft(yScale));
}
function getPaymentMethods(json) {
    const array = json.map((item) => {
        return item.paymentmethod.toUpperCase();
    });
    return new Set(array);
}
//# sourceMappingURL=index.js.map