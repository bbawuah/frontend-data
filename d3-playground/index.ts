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

interface Provincie {
  arcs: number[];
  id: string;
  properties: {
    FID: string;
    jrstatcode: string;
    rubriek: string;
    statcode: string;
    statnaam: string;
  };
  type: string;
}

interface GEOType {
  provincie_2020: {
    geometries: Provincie[];
    type: string;
  };
}

interface GEOData {
  arcs: number[][];
  bbox: number[];
  objects: {
    provincie_2020: {
      geometries: Provincie[];
      type: string;
    };
  };
  transform: {
    scale: number[];
    translate: number[];
  };
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

  const GEOres = await fetch(
    "https://cartomap.github.io/nl/wgs84/provincie_2020.topojson"
  );
  const GEOjson = await GEOres.json();

  const bbox = [11.825, 53.7253321, -68.6255319, 7.2274985];

  GEOjson.bbox = bbox;
  console.log(GEOjson);

  renderGEO(GEOjson);
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

function renderGEO(data: any) {
  const path = d3.geoPath();
  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  const width = 975;
  const height = 610;

  const svg = d3.select(".geo-chart").classed("geo", true).on("click", reset);

  const g = svg.append("g");

  const projection = d3.geoMercator().scale(6000).center([5.116667, 52.17]);
  const pathGenerator = path.projection(projection);

  const provincies = g
    .append("g")
    .attr("fill", "#444")
    .attr("cursor", "pointer")
    .selectAll("path")
    .data((topojson.feature(data, data.objects.provincie_2020) as any).features)
    .join("path")
    .on("click", clicked)
    .attr("d", path);

  provincies.append("title").text((data: any) => data.properties.statname);

  svg.call(zoom);

  function reset() {
    provincies.transition().style("fill", null);
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform as any,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node() as any).invert([width / 2, height / 2])
      );
  }

  function clicked(event: any, d: any) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    provincies.transition().style("fill", null);
    d3.select(this).transition().style("fill", "red");
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform as any,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node() as any)
      );
  }

  function zoomed(event: any) {
    const { transform } = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }
}
