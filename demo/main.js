function umlauts(value){let umlaut=value.toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/é/g,"e").replace(/ô/g,"o").replace(/(\.|,|\(|\)|\')/g,"");return umlaut}function getShort(value="",maxLength){const vowels=["a","e","i","o","u"];const firstChar=value[0];const lastChar=value[value.length-1];let charChunks=value.substring(1,value.length-2).split("");charChunks=charChunks.filter((char)=>vowels.indexOf(char)===-1);while(charChunks.length>maxLength-1){charChunks=charChunks.filter((char,idx)=>idx%2!==0)}return firstChar+charChunks.join("")+lastChar}function shortme(input="",options={}){const delimiterChar=options.delimiter||"_";const maxCharLength=options.maxCharLength||16;input=decodeURIComponent(input).trim();const fragments=input.split(" ");const maxIDX=fragments.length-1;const isAcronym=fragments.filter((fragm)=>fragm.length<4);const edgeCases={deutschland:"dtl",volkswagen:"vw"};let output="";fragments.forEach((fragment,idx)=>{const delimiter=idx===maxIDX?"":delimiterChar;fragment=umlauts(fragment);if(edgeCases[fragment]){output+=edgeCases[fragment]+delimiter;}else if(fragment.length<maxCharLength&&fragments.length===1){output+=fragment+delimiter;}else if(fragments.length>2&&isAcronym.length===0){output+=fragment[0];}else if(fragments.length>2&&fragment.length<5){output+=fragment[0]+delimiter}else{output+=getShort(fragment,maxCharLength)+delimiter}});return output};


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
