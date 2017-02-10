const assert = require("assert");
const psAnalyticsClient = require("../index");

describe("psAnalyticsClient", () => {

  const options = {
    pgOptions: "postgres://postgres:badgermushroom@192.168.33.17:5432/ps-api-development"
  };
  psAnalyticsClient.init(options);

  describe("sendSuggestLog", () => {

    it("should send suggestLog", () => {

      return psAnalyticsClient.sendSuggestLog({
        url: '/pearls/suggest?q=cafes%20in%20london&my-lat=51.530914599999996&my-lon=-0.1820927&my-address=&_limit=8'
      });
    });
  });
});
