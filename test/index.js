const assert = require("assert");
const psAnalyticsClient = require("../index");

describe("psAnalyticsClient", () => {

  const options = {
    pgOptions: "postgres://pearlshare:76DX2bkXJJX9JQJaUe@ps-analytics.cabxqlyyiccn.eu-west-1.rds.amazonaws.com:5432/ps_analytics_pro"
  };

  describe("sendSuggestLog", () => {

    it("should send suggestLog", () => {

      psAnalyticsClient.init(options);

      return psAnalyticsClient.sendSuggestLog({
        url: '/pearls/suggest?q=cafes%20in%20london&my-lat=51.530914599999996&my-lon=-0.1820927&my-address=&_limit=8'
      });
    });
  });
});
