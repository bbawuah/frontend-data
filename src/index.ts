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

enum AreaManagerID {
  AM1 = "299",
  AM2 = "518",
  AM3 = "677",
  AM4 = "243",
  AM5 = "243",
  AM6 = "402",
  AM7 = "642",
  AM8 = "202",
  AM9 = "439",
  AM10 = "546",
  AM11 = "715",
  AM12 = "867",
  AM13 = "363",
  AM14 = "384",
  AM15 = "307",
  AM16 = "361",
  AM17 = "935",
  AM18 = "1900",
  AM19 = "855",
  AM20 = "203",
  AM21 = "106",
  AM22 = "777",
  AM23 = "118",
  AM24 = "281",
  AM25 = "150",
  AM26 = "344",
  AM27 = "599",
  AM28 = "858",
  AM29 = "153",
  AM30 = "606",
  AM31 = "1942",
  AM32 = "1949",
  AM33 = "664",
  AM34 = "826",
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

interface Area {
  areamanagerid: string;
  enddatesellingpoint: string;
  sellingpointdesc: string;
  location: {
    human_address: string;
    latitude: string;
    longitude: string;
  };
  sellingpointid: string;
  startdatesellingpoint: string;
}
interface SellingPoints {
  area: string;
  areas: Area[];
}

const selectOption = document.getElementById("select") as HTMLTextAreaElement;

(async () => {
  const paymentMethodsResponse = await fetch(
    "https://opendata.rdw.nl/resource/r3rs-ibz5.json"
  );
  const paymentMethodsJson = await paymentMethodsResponse.json();

  const GEOres = await fetch(
    "https://cartomap.github.io/nl/wgs84/provincie_2020.topojson"
  );
  const GEOjson = await GEOres.json();

  const sellingPointsResponse = await fetch(
    "https://opendata.rdw.nl/resource/cgqw-pfbp.json"
  );
  const sellingPointsJson = await sellingPointsResponse.json();

  const paymentMethods = Object.values(PaymentMethods);

  const paymentData: D3Data[] = paymentMethods.map((payment) => {
    const paymentMethodAreas = paymentMethodsJson.filter(
      (item: AreaType) => item.paymentmethod.toUpperCase() === payment
    );

    return {
      paymentMethodTitle: payment,
      areas: paymentMethodAreas,
    };
  });

  renderD3(paymentData);

  const bbox = [11.825, 53.7253321, -68.6255319, 7.2274985];
  GEOjson.bbox = bbox;
  const areas = Object.values(AreaManagerID);

  const formattedArraySellingPoints: SellingPoints[] = areas.map((area) => {
    const paymentMethodAreas = sellingPointsJson.filter(
      (item: any) => item.areamanagerid === area
    );

    return {
      area: area,
      areas: paymentMethodAreas,
    };
  });

  renderGEO(
    d3.select(".geo-chart"),
    GEOjson,
    formattedArraySellingPoints,
    paymentData
  );

  selectOption.addEventListener("change", () => {
    if (selectOption.value === "payment") {
      renderGEO(
        d3.select(".geo-chart"),
        GEOjson,
        formattedArraySellingPoints,
        paymentData
      );
    } else {
      renderGEO(
        d3.select(".geo-chart"),
        GEOjson,
        startDateData(formattedArraySellingPoints),
        paymentData
      );
    }
  });
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

function startDateData(arr: SellingPoints[]) {
  const filterOpDatum = arr
    .map((data) =>
      data.areas.filter((data) => {
        return data.startdatesellingpoint.includes("2019");
      })
    )
    .filter((d) => d.length !== 0);

  const typedFilterDatum = filterOpDatum.map((arr) => {
    return {
      area: arr[0].areamanagerid,
      areas: arr,
    };
  });

  return typedFilterDatum;
}

function renderGEO(
  selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  geoData: any,
  sellingPoints: SellingPoints[],
  paymentData: D3Data[]
) {
  const path = d3.geoPath();
  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  console.log(sellingPoints);

  const radiusScale = d3.scaleSqrt();

  const width = 975;
  const height = 610;

  const svg = selection.classed("geo", true).on("click", reset);

  let g = (svg.selectAll("g") as d3.Selection<
    SVGGElement,
    unknown,
    d3.BaseType,
    unknown
  >).data([null]);

  g = g.enter().append("g").merge(g);

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
    .data(
      (topojson.feature(geoData, geoData.objects.provincie_2020) as any)
        .features
    )
    .join("path")
    .attr("d", path)
    .on("click", clicked);

  // Add circles:
  const circles = (g.selectAll("myCircles") as d3.Selection<
    SVGCircleElement,
    SellingPoints,
    SVGGElement,
    unknown
  >).data(sellingPoints);

  circles.exit().remove();

  circles
    .enter()
    .append("circle")
    .attr("cx", (data: SellingPoints) => {
      console.log(data.areas);
      return projection([
        parseFloat(data.areas[0].location.longitude),
        parseFloat(data.areas[0].location.latitude),
      ])[0];
    })
    .attr("cy", function (data: SellingPoints) {
      return projection([
        parseFloat(data.areas[0].location.longitude),
        parseFloat(data.areas[0].location.latitude),
      ])[1];
    })
    .attr("r", (data: SellingPoints) => {
      return radiusScale(data.areas.length);
    })
    .merge(circles)
    .style("fill", "#fff")
    .attr("stroke-width", 3)
    .attr("fill-opacity", 0.4)
    .attr("cursor", "pointer")
    .on("mousemove", mouseMove)
    .on("mouseout", mouseOut);

  svg.call(zoom);

  function mouseMove(event: any, data: SellingPoints) {
    d3.select(this).style("fill", "black");

    const rawPaymentArray = paymentData.map((pData) => {
      const filter = pData.areas.filter(
        (area) => area.areamanagerid === data.area
      );
      const methods = filter.map((d) => d.paymentmethod);
      return Array.from(new Set(methods));
    });

    const cleanPaymentArray = rawPaymentArray.filter((d) => d.length !== 0);
    tooltip
      .classed("hidden", false)
      .attr(
        "style",
        "left:" +
          (() => event.clientX + 20) +
          "px; top:" +
          (() => event.clientX + 20) +
          "px"
      ).html(`
      Aantal verkooppunten: ${data.areas.length}\n
      Bekende betalingsmethodes: ${
        cleanPaymentArray.map((d) => ` ${d}`)
          ? cleanPaymentArray.map((d) => ` ${d}`)
          : "Niet bekend"
      }
      `);
  }

  function mouseOut() {
    d3.select(this).style("fill", "#fff");

    tooltip.classed("hidden", true);
  }

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
    d3.select(this).transition().style("fill", "#AAA");
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
