"use strict";

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
    options: {
      delimiter: "_",
      maxCharLength: 32,
    },
    brandData: [],
    campaignData: ["Volks-", "für Deutschland", "Brand Story", "Product Story"],
    formatData: [],
    publisherData: [],
    protectedValues: [],
    slug: "",
    copied: false,
  },
  async created() {
    this.brandData = await this.fetchAPI("./data/brands.json");
    this.formatData = await this.fetchAPI("./data/formats.json");
    this.publisherData = await this.fetchAPI("./data/publishers.json");

    this.formatData.forEach((format) => this.protectedValues.push(format.slug));
    this.publisherData.forEach((publisher) =>
      this.protectedValues.push(publisher.slug)
    );

    this.setSearchParams();
  },
  methods: {
    clear() {
      for (const prop in this.query) {
        this.query[prop] = "";
      }
    },
    updateSlug() {
      const values = Object.values(this.query).join(" ");

      this.copied = false;
      this.slug = shortme(values, {
        delimiter: this.options.delimiter,
        maxCharLength: this.options.maxCharLength,
        protect: this.protectedValues,
      });
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
    setSearchParams() {
      const searchParams = window.location.search.substring(1).split("&");
      const queryKeys = Object.keys(this.query);

      for (let searchPair of searchParams) {
        searchPair = searchPair.split("=");
        const searchKey = searchPair[0];
        const searchValue = decodeURIComponent(searchPair[1]);

        if (queryKeys.indexOf(searchKey) === -1) continue;
        this.query[searchKey] = searchValue;
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
        this.updateSlug();
      },
    },
    options: {
      deep: true,
      handler() {
        this.updateSlug();
      },
    },
  },
});
