enum PaymentMethods {
  VPAY = "VPAY",
  CREDITCARD = "CREDITCARD",
  CASH = "CASH",
  MAESTRO = "MAESTRO",
  PIN = "PIN",
  CHIPKNIP = "CHIPKNIP",
  COINS = "COINS",
  BETAALAUTOMAAT = "BETAALAUTOMAAT",
  POS = "POS",
  CHIP = "CHIP",
  BELPARKEREN = "BELPARKEREN",
  BANKNOTES = "BANKNOTES",
  MASTERCARD = "MASTERCARD",
  VISA = "VISA",
  MOBIEL = "MOBIEL",
  AMEX = "AMEX",
  DIP_TAP_GO = "DIP-TAP&GO",
  DIP_GO = "DIP-GO",
  XXIMIO = "XXIMIO",
  DINERS_CLUB = "DINERS-CLUB",
}

interface AreaType {
  areaid: string;
  areamanagerid: string;
  paymentatexit: string;
  paymentatpaystation: string;
  paymentmethod: string;
  startdate: string;
}

interface D3Data {
  paymentMethodTitle: string;
  areas: AreaType[];
}

(async () => {
  const res = await fetch("https://opendata.rdw.nl/resource/r3rs-ibz5.json");

  const json = await res.json();

  const paymentMethods = Object.values(PaymentMethods);

  const formattedArray: D3Data[] = paymentMethods.map((payment) => {
    const paymentMethodAreas = json.filter(
      (item: AreaType) => item.paymentmethod.toUpperCase() === payment
    );

    return {
      paymentMethodTitle: payment,
      areas: paymentMethodAreas,
    };
  });
  console.log(formattedArray);
  renderD3(formattedArray);
})();

function renderD3(parkingData: D3Data[]) {
  const xScale = d3
    .scaleBand()
    .domain(parkingData.map((data) => data.paymentMethodTitle))
    .rangeRound([0, 700])
    .padding(0.1);
  const yScale = d3.scaleLinear().domain([0, 260]).range([300, 0]);

  const container = d3.select("svg").classed("container", true);

  // Bars
  container
    .selectAll(".bar")
    .data(parkingData)
    .enter()
    .append("rect")
    .text((data) => data.paymentMethodTitle)
    .classed("bar", true)
    .attr("width", xScale.bandwidth())
    .attr("height", (data) => 300 - yScale(data.areas.length))
    .attr("x", (data) => xScale(data.paymentMethodTitle))
    .attr("y", (data) => yScale(data.areas.length));

  container.append("g").attr("transform", "translate(0,300)"); // This controls the vertical position of the Axis
  // .call(d3.axisBottom(xScale));
}

function getPaymentMethods(json: AreaType[]): Set<string> {
  const array = json.map((item: AreaType) => {
    return item.paymentmethod.toUpperCase();
  });

  return new Set(array);
}
