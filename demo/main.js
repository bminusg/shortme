import shortme from "./modules/shortme.js";

// FORBES BRAND API
//https://www.forbes.com/forbesapi/org/powerful-brands/2020/position/true.json?limit=200

const app = new Vue({
  el: "#app",
  data: {
    query: {
      brand: "",
      campaign: "",
      format: "",
    },
    brandData: [],
    campaignData: ["Volks-", "für Deutschland", "Brand Story", "Product Story"],
    formatData: [],
    publisherData: [],
    slug: "",
    copied: false,
  },
  async created() {
    this.brandData = await this.fetchAPI("./data/brands.json");
    this.formatData = await this.fetchAPI("./data/formats.json");
    this.publisherData = await this.fetchAPI("./data/publishers.json");
  },
  methods: {
    clear() {
      for (const prop in this.query) {
        this.query[prop] = "";
      }
    },
    async fetchAPI(uri) {
      try {
        const data = await fetch(uri);
        const json = await data.json();

        return json;
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    fallbackCopyTextToClipboard(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        if (successful) this.copied = true;
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }

      document.body.removeChild(textArea);
    },
    copyTextToClipboard(text) {
      if (!navigator.clipboard) return this.fallbackCopyTextToClipboard(text);

      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Async: Copying to clipboard was successful!");
          this.copied = true;
        })
        .catch((err) => {
          console.error("Async: Could not copy text: ", err);
        });
    },
  },
  watch: {
    query: {
      deep: true,
      handler() {
        this.copied = false;
        const keys = Object.keys(this.query);
        const keysLength = keys.length - 1;
        const delimiter = "-";
        let slug = "";

        for (const prop in this.query) {
          const idx = keys.indexOf(prop);
          let value = shortme(this.query[prop]);

          if (value === "") continue;
          if (idx < keysLength) value += delimiter;

          slug += value;
        }

        this.slug = slug;
      },
    },
  },
});
