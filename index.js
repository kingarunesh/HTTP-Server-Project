const fs = require("fs");
const url = require("url");
const http = require("http");

// TEMPLATE REPLACE
const tempReplace = (temp, post) => {
  let output = temp.replace(/{%IMAGE%}/g, post.image);
  output = output.replace(/{%TITLE%}/g, post.title);
  output = output.replace(/{%DATE%}/g, post.date);
  output = output.replace(/{%ID%}/g, post.id);
  output = output.replace(/{%AUTHOR%}/g, post.author);
  output = output.replace(/{%DESCRIPTION%}/g, post.description);

  return output;
};

// ACCESS FILES
const home = fs.readFileSync(`${__dirname}/templates/index.html`, "utf-8");
const posts = fs.readFileSync(`${__dirname}/templates/posts.html`, "utf-8");
const detail = fs.readFileSync(`${__dirname}/templates/post-detail.html`, "utf-8");
const card = fs.readFileSync(`${__dirname}/templates/post-card.html`, "utf-8");
const about = fs.readFileSync(`${__dirname}/templates/about.html`, "utf-8");

const db = fs.readFileSync(`${__dirname}/database/data.json`, "utf-8");
const data = JSON.parse(db);

// CREATE SERVER
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // HOME
  if (pathname === "/" || pathname === "/home" || pathname === "/index") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(home);

    // POSTS
  } else if (pathname === "/posts") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const tempCard = data.map((el) => tempReplace(card, el)).join("");

    const post = posts.replace("{%POST_CARD%}", tempCard);

    res.end(post);

    // POST DETAIL PAGE
  } else if (pathname === "/detail") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const post = data[query.id];
    const output = tempReplace(detail, post);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });

    res.end(db);

    // ABOUT
  } else if (pathname === "/about") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(about);

    // PAGE NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });

    res.end("<h1>PAGE NOT FOUND</h1>");
  }
});

server.listen(8000);
