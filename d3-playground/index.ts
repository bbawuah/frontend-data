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
  const margin = { top: 20, right: 20, bottom: 30, left: 110 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

function getPaymentMethods(json: AreaType[]): Set<string> {
  const array = json.map((item: AreaType) => {
    return item.paymentmethod.toUpperCase();
  });

  return new Set(array);
}
