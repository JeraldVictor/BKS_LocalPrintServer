// http://192.168.0.188:9100
const { ThermalPrinter, PrinterTypes } = require("node-thermal-printer");
// https://www.npmjs.com/package/node-thermal-printer
let printer = undefined;

let toDate = (item) => {
  let d = new Date(item);
  d =
    d.getDate() +
    "-" +
    d.getMonth() +
    1 +
    "-" +
    d.getFullYear() +
    " " +
    (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) +
    ":" +
    d.getMinutes() +
    " " +
    (d.getHours() >= 12 ? "PM" : "AM");
  return d;
};

const toRupee = (num) => {
  let n1, n2;
  num = num + "" || "";
  // works for integer and floating as well
  n1 = num.split(".");
  n2 = n1[1] || null;
  n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  num = n2 ? n1 + "." + n2 : n1 + ".00";
  return num;
};

module.exports = async (data) => {
  printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "tcp://192.168.0.188:9100",
    options: {
      timeout: 5000,
    },
  });

  printer.alignCenter();
  printer.bold(true);
  printer.underline(true);
  printer.underlineThick(true);
  printer.setTextSize(1, 2);
  printer.setTypeFontA();
  printer.println("BKS");
  printer.setTypeFontB();
  printer.setTextNormal();
  printer.println("Electricals");
  printer.newLine();
  printer.println("No: 34, 19-A, 4th East Cross Rd,");
  printer.println("Gandhi Nagar, Vellore, Tamil Nadu - 632006");
  printer.bold(true);
  printer.println("Ph: +91 93448 89522 / +91 63807 06066");
  printer.newLine();
  printer.bold(false);
  printer.alignLeft();
  printer.drawLine();

  printer.setTextNormal();

  printer.bold(false);
  printer.tableCustom([
    { text: "To", align: "LEFT", width: 0.5 },
    { text: data.billedTo, align: "RIGHT" },
  ]);
  printer.tableCustom([
    { text: "Type", align: "LEFT", width: 0.5 },
    { text: data.billType, align: "RIGHT", bold: true },
  ]);
  printer.tableCustom([
    { text: "Billed By", align: "LEFT", width: 0.5 },
    { text: data.billedBy, align: "RIGHT" },
  ]);
  printer.newLine();
  printer.tableCustom([
    { text: "Date", align: "LEFT", width: 0.5 },
    { text: toDate(data.placed_on), align: "RIGHT" },
  ]);
  // printer.newLine()
  // printer.drawLine()
  // printer.println('Items:')
  // printer.newLine()
  printer.drawLine();
  printer.alignCenter();
  printer.bold(true);
  printer.tableCustom([
    // Prints table with custom settings (text, align, width, cols, bold)
    { text: "Item", align: "LEFT", bold: true, width: 0.5 },
    { text: "Qty", align: "CENTER", bold: true, width: 0.15 },
    { text: "Rate", align: "RIGHT", bold: true },
    { text: "Total", align: "RIGHT", bold: true },
  ]);
  printer.drawLine();
  printer.bold(false);
  printer.alignLeft();
  printer.setTextNormal();

  data.Items.forEach((element) => {
    printer.tableCustom([
      { text: element.name, align: "LEFT", width: 0.5 },
      { text: element.qty, align: "CENTER", width: 0.15 },
      { text: toRupee(element.rate), align: "RIGHT" },
      { text: toRupee(element.total), align: "RIGHT" },
    ]);
    printer.drawLine(); // Draws a line
  });

  printer.tableCustom([
    { text: "No.of. Items", align: "LEFT", width: 0.5 },
    { text: data.Items.length, align: "RIGHT", bold: true },
  ]);
  printer.newLine();
  printer.tableCustom([
    { text: "Total", align: "LEFT", width: 0.5 },
    { text: toRupee(data.rate), align: "RIGHT", bold: true },
  ]);
  printer.tableCustom([
    { text: "Discount", align: "LEFT", width: 0.5 },
    { text: `- ${toRupee(data.discount)}`, align: "RIGHT", bold: true },
  ]);
  printer.drawLine();
  printer.setTextDoubleHeight();
  printer.tableCustom([
    { text: "Total Payable", align: "LEFT", width: 0.5 },
    { text: toRupee(data.total), align: "RIGHT", bold: true },
  ]);
  printer.drawLine();
  printer.newLine();
  printer.alignCenter();
  printer.bold(true);
  printer.underlineThick(true);
  printer.setTextDoubleHeight();
  printer.setTextDoubleWidth();
  printer.println("Thank You Visit Again!");
  printer.cut();
  try {
    let execute = await printer.execute();
    console.log(execute);
    console.log(
      `Printing Completed. Bill No #${data.id} Printed On: ${toDate(
        new Date()
      )}`
    );
  } catch (error) {
    console.log(
      `Printing Failed. Bill No #${data.id} Printed On: ${toDate(new Date())}`
    );
    console.log(error);
  }
};
