const PDFDocument = require("pdfkit");
const fs = require("fs");
const flitzyDetails = {
  flitzyFullName: "Phyllflitzy India Private Limited",
  flitzyLogoColor: "Flitzy_logo_fullcolor.jpg",
  officeAddress1: "235, 2nd Floor",
  officeAddress2: "13th cross road, 2nd stage",
  officeAddress3: "Indira Nagar, Bengaluru - 560038",
  sampleAddress1: "Flat-206, 3rd floor, Honey Dew Appartments",
  sampleAddress2: "Mahatma Gandhi Rd. Ashirvad Colony. Hormavu",
  sampleAddress3: "BENGALURU, KARNATAKA, 560043",
  panNumber: "AAPCP4351H",
  gstNumber: "29AAPCP4351H1Z0",
  supplyPlace: "Bengaluru",
  flitzyShortName: "PHYLLFLITZY PVT LTD.",
};

async function createInvoice(inputs) {
  let pdfFileName = `orderInvoice.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfFileName));
  doc.y = 10;
  doc.x = 40;
  doc.image(flitzyDetails.flitzyLogoColor, {
    fit: [80, 80],
    align: "left",
    valign: "left",
  });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Tax Invoice/Bill of Supply/Cash Memo", 360, 15);
  doc.font("Helvetica").fontSize(9).text("(Original for Recipient)", 407, 30);

  doc.font("Helvetica-Bold").fontSize(10).text("Sold By:", 40, 80);
  doc.font("Helvetica").fontSize(10).text(flitzyDetails.flitzyFullName, 40, 95);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(flitzyDetails.officeAddress1, 40, 108);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(flitzyDetails.officeAddress2, 40, 121);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(flitzyDetails.officeAddress3, 40, 134);

  doc.font("Helvetica-Bold").fontSize(10).text("Billing Address:", 40, 165);
  doc.font("Helvetica").fontSize(10).text(inputs.userAddress1, 40, 180);
  doc.font("Helvetica").fontSize(10).text(inputs.userAddress2, 40, 193);
  doc.font("Helvetica").fontSize(10).text(inputs.userAddress3, 40, 206);

  doc.font("Helvetica-Bold").fontSize(10).text(`PAN No: `, 40, 237);
  doc.font("Helvetica").fontSize(10).text(flitzyDetails.panNumber, 85, 237);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(`GST Registration No: `, 40, 250);
  doc.font("Helvetica").fontSize(10).text(flitzyDetails.gstNumber, 145, 250);

  doc.font("Helvetica-Bold").fontSize(10).text(`Place of supply: `, 405, 157);
  doc.font("Helvetica").fontSize(10).text(flitzyDetails.supplyPlace, 490, 157);
  doc.font("Helvetica-Bold").fontSize(10).text(`Place of Delivery: `, 400, 170);
  doc.font("Helvetica").fontSize(10).text(inputs.deliveryPlace, 490, 170);

  doc.font("Helvetica-Bold").fontSize(10).text(`Order Number: `, 390, 198);
  doc.font("Helvetica").fontSize(10).text(inputs.orderId, 465, 198);
  doc.font("Helvetica-Bold").fontSize(10).text(`Order Date: `, 425, 211);
  doc.font("Helvetica").fontSize(10).text(inputs.orderDate, 485, 211);

  doc.font("Helvetica-Bold").fontSize(10).text(`Invoice Number: `, 381, 237);
  doc.font("Helvetica").fontSize(10).text(inputs.invoiceNumber, 466, 237);
  doc.font("Helvetica-Bold").fontSize(10).text(`Invoice Date: `, 418, 250);
  doc.font("Helvetica").fontSize(10).text(inputs.invoiceDate, 485, 250);

  let initialHieght = 290;
  let initialHieghtForHeading = 275;
  let initialHieghtForPayment = 290;
  let heading = "Checkout Products: ";
  let mainlength = 550;
  let tableHeader = true;
  let firstPageRows = 20;
  let firstPageSize = firstPageRows - 7;
  // inputs.checkoutDoc.products = inputs.checkoutDoc.products.slice(0, 2);

  if (inputs.modifiedDoc) {
    // inputs.modifiedDoc.products = inputs.modifiedDoc.products.slice(0, 2);
    inputs.checkoutDoc.originalCartPrice = inputs.modifiedDoc.cartPrice;

    let firstPageRowsMod = 20;
    let firstPageSizeMod = firstPageRowsMod - 4;
    let modifiedDocNextPage = 13;

    firstPageRowsMod =
      firstPageRowsMod > inputs.modifiedDoc.products.length
        ? inputs.modifiedDoc.products.length
        : firstPageRowsMod;

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`Original checkout Products: `, 40, initialHieghtForHeading);
    let rows = inputs.modifiedDoc.products.length;
    let finalPageRecords = 0;

    if (rows >= firstPageSizeMod) {
      initialHieghtForPayment = createPreviousItemsTable(
        doc,
        initialHieght,
        firstPageRowsMod,
        tableHeader,
      );
      insertProductsIntoTable(
        doc,
        initialHieght,
        inputs.modifiedDoc,
        inputs.modifiedDoc.products,
        firstPageRowsMod,
        tableHeader,
      );
      doc.addPage();
      let fullPageRowCpcty = 34;
      let remainingRows = rows - firstPageRowsMod;
      let i = firstPageRowsMod;
      let j = i + remainingRows;
      let occupiedPage = remainingRows;

      ({
        remainingRows,
        initialHieght,
        j,
        i,
        initialHieghtForPayment,
        occupiedPage,
      } = insertDynamicPagesData(
        remainingRows,
        initialHieght,
        fullPageRowCpcty,
        j,
        i,
        inputs.modifiedDoc,
        initialHieghtForPayment,
        doc,
        occupiedPage,
      ));

      initialHieghtForPayment = getRemainingHieght(
        fullPageRowCpcty,
        occupiedPage,
        doc,
        initialHieghtForPayment,
      );

      initialHieghtForPayment = insertFooter(
        doc,
        initialHieghtForPayment,
        mainlength,
        inputs.modifiedDoc,
        45,
      );
      firstPageRows = 34;
      finalPageRecords = occupiedPage;
      firstPageRows = firstPageRows - (finalPageRecords + 7);
      firstPageSize = firstPageRows - 7;
    } else {
      initialHieghtForPayment = createPreviousItemsTable(
        doc,
        initialHieght,
        rows,
        tableHeader,
      );
      insertProductsIntoTable(
        doc,
        initialHieght,
        inputs.modifiedDoc,
        inputs.modifiedDoc.products,
        rows,
        tableHeader,
      );
      initialHieghtForPayment = insertFooter(
        doc,
        initialHieghtForPayment,
        mainlength,
        inputs.modifiedDoc,
        45,
      );

      finalPageRecords = inputs.modifiedDoc.products.length;
      if (modifiedDocNextPage < rows) {
        firstPageRows = 32;
        initialHieghtForPayment = -15;
        finalPageRecords = -7;
        doc.addPage();
      }
      firstPageRows = firstPageRows - (finalPageRecords + 7);
      firstPageSize = firstPageRows - 7;
    }
    initialHieghtForHeading = initialHieghtForPayment + 55;
    heading = `Updated products after Edit Order: `;
  }

  firstPageRows =
    firstPageRows > inputs.checkoutDoc.products.length
      ? inputs.checkoutDoc.products.length
      : firstPageRows;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(heading, 40, initialHieghtForHeading);
  let rows = inputs.checkoutDoc.products.length;
  initialHieght = initialHieghtForHeading + 16;

  if (rows >= firstPageSize) {
    initialHieghtForPayment = createItemsTable(
      doc,
      initialHieght,
      firstPageRows,
      tableHeader,
    );
    insertProductsIntoTable(
      doc,
      initialHieght,
      inputs.checkoutDoc,
      inputs.checkoutDoc.products,
      firstPageRows,
      tableHeader,
    );
    doc.addPage();
    let fullPageRowCpcty = 34;
    let remainingRows = rows - firstPageRows;
    let i = firstPageRows;
    let j = i + remainingRows;
    let occupiedPage = remainingRows;

    ({
      remainingRows,
      initialHieght,
      j,
      i,
      initialHieghtForPayment,
      occupiedPage,
    } = insertDynamicPagesData(
      remainingRows,
      initialHieght,
      fullPageRowCpcty,
      j,
      i,
      inputs.checkoutDoc,
      initialHieghtForPayment,
      doc,
      occupiedPage,
    ));

    initialHieghtForPayment = getRemainingHieght(
      fullPageRowCpcty,
      occupiedPage,
      doc,
      initialHieghtForPayment,
    );

    initialHieghtForPayment = insertFooter(
      doc,
      initialHieghtForPayment,
      mainlength,
      inputs.checkoutDoc,
      120,
      true,
    );
  } else {
    initialHieghtForPayment = createItemsTable(
      doc,
      initialHieght,
      rows,
      tableHeader,
    );
    insertProductsIntoTable(
      doc,
      initialHieght,
      inputs.checkoutDoc,
      inputs.checkoutDoc.products,
      rows,
      tableHeader,
    );
    initialHieghtForPayment = insertFooter(
      doc,
      initialHieghtForPayment,
      mainlength,
      inputs.checkoutDoc,
      120,
      true,
    );
  }
  doc.end();

  setTimeout(async () => {
    console.log("Invoice PDF file created successfully !!!");
  }, 2000);

  return "Invoice PDF file created successfully !!!";
}

function insertProductsIntoTable(
  doc,
  initialHieght,
  checkoutDoc,
  products,
  n,
  tableHeader = false,
) {
  if (tableHeader) {
    initialHieght = initialHieght + 20;
  }
  let midVal = getMidValue(n);

  for (let x = 0; x < n; x++) {
    if (!products[x]) {
      break;
    }
    let prod = products[x];
    let quantity = 0;
    let price = 0;
    let productName = prod.name;
    ({ price, quantity, productName } = updateProduct(
      prod,
      price,
      quantity,
      productName,
    ));

    enterProductValues(doc, x, initialHieght, productName, quantity, price);

    if (x == midVal) {
      insertGSTandPlatformFees(doc, checkoutDoc, initialHieght);
    }
    initialHieght += 20;
  }
}

function enterProductValues(
  doc,
  x,
  initialHieght,
  productName,
  quantity,
  price,
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`${x + 1}.`, 35, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`${productName}`, 60, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`${quantity}`, 435, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(price, 472, initialHieght + 10);
}

function getMidValue(n) {
  let midVal = Math.floor(n / 2);
  if (n % 2 == 0) {
    midVal = midVal - 1;
  }
  return midVal;
}

function insertGSTandPlatformFees(doc, checkoutDoc, initialHieght) {
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`${checkoutDoc.gstPrice}`, 509, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`${checkoutDoc.transactionFee}`, 551, initialHieght + 10);
}

function updateProduct(prod, price, quantity, productName) {
  if (prod.subCategory == "Services") {
    let price_sizes = prod.price_sizes;
    for (let size of Object.keys(prod.quantity)) {
      price += price_sizes[size] * prod.quantity[size];
      quantity += prod.quantity[size];
    }
    productName = `${prod.name}_${JSON.stringify(prod.quantity)}`;
  } else {
    price = prod.price * prod.quantity;
    quantity = prod.quantity;
  }
  return { price, quantity, productName };
}

function createItemsTable(doc, initialHieght, n, tableHeader = false) {
  let lineStart = initialHieght;
  let mainlength = 550;
  let rows = tableHeader ? n + 1 : n;

  let boxSize = rows * 20;
  doc.lineJoin("miter").rect(30, initialHieght, mainlength, boxSize).stroke();

  for (let x = 0; x < rows; x++) {
    let length = 470;
    if (x == 0 && tableHeader) {
      doc.lineJoin("miter").rect(30, initialHieght, mainlength, 20).stroke();
      tableHeadings(doc, initialHieght);
    } else {
      doc.lineJoin("miter").rect(30, initialHieght, length, 20).stroke();
    }
    initialHieght += 20;
  }
  columnLines(doc, lineStart, initialHieght);
  return initialHieght;
}

function columnLines(doc, lineStart, initialHieght) {
  doc.lineCap("butt").moveTo(52, lineStart).lineTo(52, initialHieght).stroke();
  doc
    .lineCap("butt")
    .moveTo(417, lineStart)
    .lineTo(417, initialHieght)
    .stroke();
  doc
    .lineCap("butt")
    .moveTo(460, lineStart)
    .lineTo(460, initialHieght)
    .stroke();
  doc
    .lineCap("butt")
    .moveTo(500, lineStart)
    .lineTo(500, initialHieght)
    .stroke();
  doc
    .lineCap("butt")
    .moveTo(538, lineStart)
    .lineTo(538, initialHieght)
    .stroke();
}

function signatureTable(doc, initialHieght, mainlength) {
  doc.lineJoin("miter").rect(30, initialHieght, mainlength, 90).stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(`For ${flitzyDetails.flitzyShortName}`, 445, initialHieght + 45);
  doc.image("invoiceSigns/director_1.png", {
    fit: [80, 80],
    align: "right",
    valign: "right",
  });
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`Authorized Signatory :`, 35, initialHieght + 65);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(
      `Whether tax is payable under reverse charge - No`,
      35,
      initialHieght + 93,
    );
}

function deliveryTable(doc, initialHieght, mainlength, checkoutDoc, signature) {
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`Delivery :`, 35, initialHieght + 8);
  doc.lineJoin("miter").rect(30, initialHieght, mainlength, 20).stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`${checkoutDoc.transportPrice}`, 540, initialHieght + 8);

  if (checkoutDoc.redeemAmount) {
    doc.lineJoin("miter").rect(30, initialHieght, mainlength, 40).stroke();
    initialHieght = initialHieght + 28;
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`Amount Paid From Wallet :`, 35, initialHieght);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`${checkoutDoc.redeemAmount}`, 540, initialHieght);
    initialHieght = initialHieght - 28;
    doc.lineJoin("miter").rect(30, initialHieght, mainlength, 60).stroke();
    initialHieght = initialHieght + 20;
  } else {
    doc.lineJoin("miter").rect(30, initialHieght, mainlength, 40).stroke();
  }
  if (signature && checkoutDoc.originalCartPrice) {
    doc.lineJoin("miter").rect(30, initialHieght, mainlength, 40).stroke();
    initialHieght = initialHieght + 28;
    let extraAmountName = `Extra Amount`;
    let amount = checkoutDoc.originalCartPrice - checkoutDoc.cartPrice;

    if (amount < 0) {
      extraAmountName = `${extraAmountName} (Amount paid through paymeny gateway) :`;
    } else if (amount > 0) {
      extraAmountName = `${extraAmountName} (Amount added to wallet) :`;
    } else {
      extraAmountName = `Extra Amount :`;
    }
    amount = Math.abs(amount);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`${extraAmountName}`, 35, initialHieght);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`${amount}`, 540, initialHieght);
    initialHieght = initialHieght - 28;
    doc.lineJoin("miter").rect(30, initialHieght, mainlength, 60).stroke();
    initialHieght = initialHieght + 20;
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`Total payable amount :`, 35, initialHieght + 28);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`${checkoutDoc.cartPrice}`, 540, initialHieght + 28);
}

function createPreviousItemsTable(doc, initialHieght, n) {
  let lineStart = initialHieght;
  let mainlength = 550;
  let boxSize = (n + 1) * 20;
  doc.lineJoin("miter").rect(30, initialHieght, mainlength, boxSize).stroke();

  for (let x = 0; x < n + 1; x++) {
    let length = 470;
    if (x == 0) {
      doc.lineJoin("miter").rect(30, initialHieght, mainlength, 20).stroke();
      tableHeadings(doc, initialHieght);
    } else {
      doc.lineJoin("miter").rect(30, initialHieght, length, 20).stroke();
    }
    initialHieght += 20;
  }

  columnLines(doc, lineStart, initialHieght);
  return initialHieght;
}

function tableHeadings(doc, initialHieght) {
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`S.No`, 32, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Product/Service Name`, 170, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Quantity`, 423, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Price`, 470, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`GST`, 515, initialHieght + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Platform`, 545, initialHieght + 10);
}

function createPaymentTable(doc, initialHieght) {
  let lineStart = initialHieght;
  let mainlength = 550;

  doc.lineJoin("miter").rect(30, initialHieght, mainlength, 32).stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Payment Transaction Id:`, 34, initialHieght + 6);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Date & Time:`, 154, initialHieght + 6);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Invoice Value:`, 470, initialHieght + 6);

  initialHieght += 32;

  doc
    .lineCap("butt")
    .moveTo(150, lineStart)
    .lineTo(150, initialHieght)
    .stroke();
  doc
    .lineCap("butt")
    .moveTo(465, lineStart)
    .lineTo(465, initialHieght)
    .stroke();
  return initialHieght;
}

function insertValuesIntoPaymentTable(doc, initialHieght, checkoutDoc) {
  let mainlength = 550;

  doc.lineJoin("miter").rect(30, initialHieght, mainlength, 32).stroke();
  doc
    .font("Helvetica")
    .fontSize(8)
    .text(`${checkoutDoc.merchantTransactionId}`, 34, initialHieght + 16);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(`${checkoutDoc.created_date}`, 154, initialHieght + 16);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(`${checkoutDoc.cartPrice}`, 470, initialHieght + 16);
}

function insertDynamicPagesData(
  remainingRows,
  initialHieght,
  fullPageRowCpcty,
  j,
  i,
  checkoutDoc,
  initialHieghtForPayment,
  doc,
  occupiedPage,
) {
  while (remainingRows > 0) {
    initialHieght = 40;
    if (remainingRows >= fullPageRowCpcty) {
      j = i + fullPageRowCpcty;
      let products = checkoutDoc.products.slice(i, j);
      initialHieghtForPayment = createItemsTable(
        doc,
        initialHieght,
        fullPageRowCpcty,
      );
      insertProductsIntoTable(
        doc,
        initialHieght,
        checkoutDoc,
        products,
        fullPageRowCpcty,
      );
      i = i + fullPageRowCpcty;
      if (remainingRows > fullPageRowCpcty) {
        doc.addPage();
      }
      remainingRows = remainingRows - fullPageRowCpcty;
    } else {
      j = i + remainingRows;
      let products = checkoutDoc.products.slice(i, j);
      initialHieghtForPayment = createItemsTable(
        doc,
        initialHieght,
        remainingRows,
        false,
      );
      insertProductsIntoTable(
        doc,
        initialHieght,
        checkoutDoc,
        products,
        remainingRows,
      );
      occupiedPage = remainingRows;
      remainingRows = 0;
    }
  }
  return {
    remainingRows,
    initialHieght,
    j,
    i,
    initialHieghtForPayment,
    occupiedPage,
  };
}

function insertFooter(
  doc,
  initialHieghtForPayment,
  mainlength,
  checkoutDoc,
  hieghtAddOn,
  signature = false,
) {
  deliveryTable(
    doc,
    initialHieghtForPayment,
    mainlength,
    checkoutDoc,
    signature,
  );
  if (checkoutDoc.redeemAmount) {
    initialHieghtForPayment = initialHieghtForPayment + 20;
  }
  if (signature) {
    if (checkoutDoc.originalCartPrice) {
      initialHieghtForPayment = initialHieghtForPayment + 20;
    }
    signatureTable(doc, initialHieghtForPayment, mainlength);
  }
  initialHieghtForPayment = initialHieghtForPayment + hieghtAddOn;
  createPaymentTable(doc, initialHieghtForPayment);
  insertValuesIntoPaymentTable(doc, initialHieghtForPayment, checkoutDoc);
  return initialHieghtForPayment;
}

function getRemainingHieght(
  fullPageRowCpcty,
  occupiedPage,
  doc,
  initialHieghtForPayment,
) {
  let remainingSpace = (fullPageRowCpcty - occupiedPage) * 20;
  let totalTableSize = 140;
  if (remainingSpace <= totalTableSize) {
    doc.addPage();
    initialHieghtForPayment = 40;
  } else if (occupiedPage == 0) {
    initialHieghtForPayment = 40;
  }
  return initialHieghtForPayment;
}
module.exports = {
  createInvoice,
};
