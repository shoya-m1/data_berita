const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");

module.exports = {
  newArtikels: async (req, res) => {
    const page = req.query.page;
    const url = `https://cekfakta.kompas.com/${page == null ? 1 : page}`;
    const resp = await fetch(url);
    console.log(resp);
    try {
      if (resp.status >= 400) {
        return res.json({
          message: `Server Error ${resp.status}`,
        });
      } else {
        const text = await resp.text();
        const $ = cheerio.load(text);
        var jsonData = [];

        $(".hoax__list").each(function (i, e) {
          jsonData.push({});
          const $e = $(e);
          jsonData[i].title = $e.find("h1").text().trim();
          jsonData[i].label = $e.find(".hoax__widget__button > span").text().trim();
          jsonData[i].slug = $e
            .find("a")
            .attr("href")
            .replace(/^.*\/\/[^\/]+/, "");
          jsonData[i].date = $e.find(".hoax__list__time").text().trim();
        });
        const currentPage = $(".hoax__paging ul > li.hoax__pagingItem--active").text();
        const nextPage = $(".hoax__paging ul > divv.hoax__pagingItem a").attr("data-ci-pagination-page");

        const totalPage = $(".hoax__paging ul > li:last-child a").attr("data-ci-pagination-page");

        res.json({
          status: resp.status,
          currentPage: currentPage,
          nextPage: nextPage,
          totalPage: totalPage,
          data: jsonData,
        });
        // console.log(jsonData)
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  searchArtikels: async (req, res) => {
    const page = req.query.page;
    const query = req.query.q;
    const url = `https://turnbackhoax.id/page/${page == null ? 1 : page}/?s=${query == null ? "" : query}`;
    const resp = await fetch(url);
    console.log(url);
    try {
      if (resp.status >= 400) {
        return res.json({
          message: `Server Error ${resp.status}`,
        });
      } else {
        const text = await resp.text();
        const $ = cheerio.load(text);
        var jsonData = [];

        $("article").each(function (i, e) {
          jsonData.push({});
          const $e = $(e);
          jsonData[i].img = $e.find("figure.mh-loop-thumb > a > img").attr("src");
          jsonData[i].title = $e.find("h3").text().trim();
          jsonData[i].link = $e.find("h3 > a").attr("href");
          jsonData[i].slug = $e
            .find("h3 > a")
            .attr("href")
            .replace(/^.*\/\/[^\/]+/, "");
          jsonData[i].date = $e.find("div.mh-meta.mh-loop-meta > span.mh-meta-date.updated").text().trim();
          jsonData[i].author = $e.find("div.mh-meta.mh-loop-meta > span.mh-meta-author.author.vcard > a").text().trim();
        });
        const currentPage = $("#main-content > div > nav > div > span.page-numbers.current").text();
        const nextPage = $("#main-content > div > nav > div > a:nth-child(2)").text();

        const totalPage = $("#main-content > div > nav > div > a:nth-child(4)").text();

        res.json({
          status: resp.status,
          currentPage: currentPage,
          nextPage: nextPage,
          totalPage: totalPage,
          data: jsonData,
        });
        // console.log(jsonData)
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  contentArtikels: async (req, res) => {
    const url = `https://www.kompas.com${req.query.slug}`;
    const resp = await fetch(url);
    console.log(url);
    try {
      if (resp.status >= 400) {
        return res.json({
          message: `Server Error ${resp.status}`,
        });
      } else {
        const text = await resp.text();
        const $ = cheerio.load(text);
        // console.log($);
        // var jsonData = [];

        const title = $("h1.read__title").text().trim();
        const date = $(".read__time > a").text().trim();
        const author = $(".credit-title-nameEditor").text().trim();
        const category = $("h2.hoax__artikel__title").text().trim();
        const content = $(".read__content > div.clearfix").text().replace(/\s+/g, " ").trim();
        // jsonData.push({});

        res.json({
          status: resp.status,
          title: title,
          date: date,
          author: author,
          category: category,
          content: content,
        });
        // console.log(jsonData)
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
