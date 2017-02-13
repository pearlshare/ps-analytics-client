const assert = require("assert");
const psAnalyticsClient = require("../lib/client");

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


  describe("sendSearchLog", () => {

    it("should store long keywords", function () {
      return psAnalyticsClient.sendSearchLog({
        keywords: "They are highly skilled and time-consuming method of repairing damage to cloth by taking individual threads from a hem, side seam or other concealed part of the garment of the same type and re weaving them over the damaged area to make as near perfect repairs as is humanly possible"
      })
      .then(function (results) {
        assert.ok(results[0].id);
      });
    });

    it("should store keys", function () {
      return psAnalyticsClient.sendSearchLog({
        accountId: 1,
        categoryId: 2,
        categoryIds: [3, 4],
        collectionId: 5,
        featured: false,
        friendDepth: 2,
        keywords: "Some text",
        lat: 6.7,
        lon: 7.8,
        radius: 900,
        userId: 10,
        likedBy: 11,
        interests: true,
        ids: [14, 15],
        itemType: "pearl",
        originalUrl: "https://app.pearlshare.com/pearls?lat=40.7127837&lon=-74.0059413&radius=2000"
      })
      .then(function (results) {
        assert.ok(results[0].id);
      });
    });
  });
});
