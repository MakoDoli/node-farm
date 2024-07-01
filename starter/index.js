const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");

// accessing   FILE   SYSTEM

//  READ from files
// const text = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// const desktop = fs.readFileSync("../../Desktop/refresh.txt", "utf-8");
// console.log(desktop);

// WRITE  to files
// const textOut = `This is what we know about ${text}. \nCreated at ${Date.now()}`;
// fs.writeFileSync("./starter/txt/output.txt", textOut);

// console.log(textOut);

// Non-blocking -async
// fs.readFile("./starter/txt/starttt.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!🚫🔴");
//   fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.writeFile(
//       "./starter/txt/final.txt",
//       ` ${data1}\n${data2}`,
//       "utf-8",
//       (err) => {
//         console.log("Error should be here 🚨" + err);
//       }
//     );
//   });
//   console.log(data1);
// });
// console.log("I'm after read-this but I log first and then comes read-this");

/////////////////////////////
//     SERVER

// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  //   OVERVIEW PAGE

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));

    const tempOverviewHtml = tempOverview.replace(
      "{%PRODUCT_CARDS%}",
      cardsHtml
    );
    res.end(tempOverviewHtml);

    //    PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //      API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    //   res.writeHead(200, {
    //     "Content-type": "application/json",
    //   });
    //   res.end(data);
    // });

    //                        NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on port 8000");
}); // 127.0.0.1 = localhost
