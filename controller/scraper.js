const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");

module.exports = {
  newArtikels: async (req, res) => {
    const page = req.query.page;
    // const url = `https://cekfakta.kompas.com/${page == null ? 1 : page}`;
    // const url = `https://www.detik.com/search/searchnews?query=gempa&page=${page == null ? 1 : page}&result_type=relevansi&fromdatex=31/05/2020&todatex=31/05/2024`;
    // const url = `https://www.detik.com/search/searchnews?query=gempa&page=${page == null ? 1 : page}&result_type=relevansi&siteid=3&fromdatex=31/05/2020&todatex=31/05/2024`;
    // const url = `https://www.detik.com/search/searchnews?query=banjir&page=${page == null ? 1 : page}&result_type=relevansi&siteid=3&fromdatex=31/05/2020&todatex=31/05/2024`;
    // const url = `https://www.detik.com/search/searchnews?query=longsor&page=${page == null ? 1 : page}&result_type=relevansi&siteid=3&fromdatex=31/05/2020&todatex=31/05/2024`;
    // const url = `https://www.detik.com/search/searchnews?query=tornado&page=${page == null ? 1 : page}&result_type=relevansi&siteid=3&fromdatex=31/05/2020&todatex=31/05/2024`;
    // const url = `https://www.detik.com/search/searchnews?query=erupsi&page=${page == null ? 1 : page}&result_type=relevansi&siteid=3&fromdatex=31/05/2020&todatex=31/05/2024`;
    const url = `https://www.detik.com/search/searchnews?query=tsunami&page=${page == null ? 1 : page}&result_type=relevansi&siteid=3&fromdatex=31/05/2020&todatex=31/05/2024`;


    const resp = await fetch(url);
    // console.log(resp);
    try {
      if (resp.status >= 400) {
        return res.json({
          message: `Server Error ${resp.status}`,
        });
      } else {
        const text = await resp.text();
        const $ = cheerio.load(text);
        var jsonData = [];

        $(".list-content__item").each(function (i, e) {
          jsonData.push({});
          const $e = $(e);
          jsonData[i].title = $e.find("h3 > a").text().trim();
          // jsonData[i].label = $e.find(".hoax__widget__button > span").text().trim();
          jsonData[i].slug = $e
            .find("a")
            .attr("href")
            .replace(/^.*\/\/[^\/]+/, "");
          jsonData[i].date = $e.find(".media__date > span").text().trim();
        });
        const currentPage = $(".pagination > .pagination__item--active").text();
        const nextPageUrl = $(
          "a.pagination__item.itp-pagination:contains('Next')"
        ).attr("href");
        const nextPage = new URLSearchParams(nextPageUrl.split("?")[1]).get(
          "page"
        );

        // const totalPage = $(".hoax__paging ul > li:last-child a").attr("data-ci-pagination-page");

        res.json({
          status: resp.status,
          currentPage: currentPage,
          nextPage: nextPage,
          // totalPage: totalPage,
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
    const url = `https://news.detik.com${req.query.slug}`;
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.85 Safari/537.36",
      },
      redirect: "follow",
    });
    console.log(url);
    try {
      if (resp.status >= 400) {
        return res.json({
          message: `Server Error ${resp.status}`,
        });
      } else {
        const text = await resp.text();
        const $ = cheerio.load(text);

        const title = $("h1.detail__title").text().trim();
        const paragraphs = [];
        $(".detail__body-text > p").each((i, e) => {
          paragraphs.push($(e).text().trim());
        });

        res.json({
          status: resp.status,
          title: title,
          content: paragraphs,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
