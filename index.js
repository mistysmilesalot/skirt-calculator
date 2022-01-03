const _ = require("lodash");
const round = (x) => _.round(x, 2);

/*=============================================
=                  Constants                  =
=============================================*/
const CIRCLE_FULLNESS = 1; // 1 = full circle skirt
const CIRCUM_TOP = 44;
const TOP_RADIUS = round(CIRCUM_TOP / 2 / Math.PI);
const SKIRT_LEN = 45;
const CIRCLE_TOTAL_RADIUS = SKIRT_LEN + TOP_RADIUS;
const CIRCUM_BOTTOM = round(
  CIRCLE_TOTAL_RADIUS * 2 * Math.PI * CIRCLE_FULLNESS
);
const STARTING_LENGTH_FROM_TOP = 24;
const STARTING_LENGTH = SKIRT_LEN - STARTING_LENGTH_FROM_TOP;
// each layer needs to increase in length greater than just the gap between layers because of each layer extends further away from the center
const HORIZONTAL_LENGTH_OFFSET = 1;
const LAYER_GAP = STARTING_LENGTH_FROM_TOP/6; // inches

const BLACK = { name: "Black", available: 360, width: 58 };
const PURPLE = { name: "Purple", available: 1440, width: 54 };
/*===========  End of Constants  ============*/

/*=============================================
=                  Functions                  =
=============================================*/
const calcNumPanelsActual = (width) => round(CIRCUM_BOTTOM / (width - 0.5));
const calcNumPanels = (width) => _.ceil(calcNumPanelsActual(width));
const calcLayer = (layer, color) => {
  const horiOffset = HORIZONTAL_LENGTH_OFFSET * layer;
  const vertOffset = LAYER_GAP * layer;
  const layerIncrease = round(horiOffset + vertOffset);
  const fromTop = Math.min(SKIRT_LEN, STARTING_LENGTH_FROM_TOP - vertOffset);
  var layerLength = Math.min(
    STARTING_LENGTH + layerIncrease,
    SKIRT_LEN + horiOffset
  );
  var layerTotal = round(layerLength * color.numPanels);
  return {
    label: layer + 1,
    fromTop: fromTop,
    total: layerTotal,
    length: layerLength,
    color: color.name,
  };
};
const printLayerMeasurements = ({ label, fromTop, length, total, color }) => {
  console.log(
`${label};\
${fromTop};\
${length};\
${round(length / 12)};\
${round(length / 36)};\
${total};\
${round(total / 12)};\
${round(total / 36)};\
${color}`
  );
};

const printConstants = () => {
  console.log("Circle Fullness;" + CIRCLE_FULLNESS * 100 + "%");
  console.log("Circum Top;" + CIRCUM_TOP);
  console.log("Top Radius;" + TOP_RADIUS);
  console.log("Skirt Len;" + SKIRT_LEN);
  console.log("Circle Total Radi;" + CIRCLE_TOTAL_RADIUS);
  console.log("Circum Bottom;" + CIRCUM_BOTTOM);
  console.log("Starting Length;" + STARTING_LENGTH);
  console.log("Horizontal Length Offset;" + HORIZONTAL_LENGTH_OFFSET);
  console.log("Layer Gap;" + LAYER_GAP);
};

const printReportHead = (b, p) => {
  printConstants();
  console.log(
    `Number of purple panels;${p.numPanels};${p.numPanelsActual}
Number of black panels;${b.numPanels};${b.numPanelsActual}
Starting ${STARTING_LENGTH_FROM_TOP}" from the top\n
Layer;From Top;Panel Length;;;Total Length;;;Color
;;in;ft;yd;in;ft;yd;`
  );
};

const printRemainderReport = (color, val) =>
  console.log(`${color} remainder;${val}";${round(val / 36)} yds`);
/*===========  End of Functions  ============*/

BLACK.numPanels = calcNumPanels(BLACK.width);
PURPLE.numPanels = calcNumPanels(PURPLE.width);
BLACK.numPanelsActual = calcNumPanelsActual(BLACK.width);
PURPLE.numPanelsActual = calcNumPanelsActual(PURPLE.width);

var runningTotalPurple = 0;
var runningTotalBlack = 0;
var useBlack = false;
var layer = 0;

printReportHead(BLACK, PURPLE);

while (BLACK.available >= runningTotalBlack) {
  var layerData = calcLayer(layer, useBlack ? BLACK : PURPLE);
  if (useBlack) {
    if (runningTotalBlack + layerData.total > BLACK.available) break;
    runningTotalBlack += layerData.total;
    ++layer;
    printLayerMeasurements(layerData);
  } else {
    if (runningTotalPurple + layerData.total > PURPLE.available) {
      useBlack = true;
      continue;
    }
    runningTotalPurple += layerData.total;
    ++layer;
    printLayerMeasurements(layerData);
  }
}
printRemainderReport("Purple", round(PURPLE.available - runningTotalPurple));
printRemainderReport("Black", round(BLACK.available - runningTotalBlack));
