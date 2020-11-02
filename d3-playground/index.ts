interface DataType {
  id: string;
  value: number;
  region: string;
}

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
  DIP_GO = "DIP_GO",
  XXIMIO = "XXIMIO",
  DINERS_CLUB = "DINERS_CLUB",
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

  renderD3(formattedArray);
})();

function renderD3(parkingData: D3Data[]) {
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

function getPaymentMethods(json: AreaType[]): Set<string> {
  const array = json.map((item: AreaType) => {
    return item.paymentmethod.toUpperCase();
  });

  return new Set(array);
}
