const { createApp } = Vue;
createApp({
  data() {
    return {
      input: "",
      output: "",
      qrCodeUrl: "",
      error: "",
      message:''
    };
  },
  methods: {
    async isValidHttpUrl(url) {
      try {
        const newUrl = new URL(url);
        if (newUrl.protocol === "http:" || newUrl.protocol === "https:") {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.log("non valid url");
        return false;
      }
    },
    async shortenUrl() {
      try {
        const isValidUrl = await this.isValidHttpUrl(this.input);
        this.error=''
        this.output=''
        this.message=''
        if (isValidUrl) {
          const response = await axios.post(
            "https://api-ssl.bitly.com/v4/shorten",
            {
              long_url: this.input,
              domain: "bit.ly",
            },
            {
              headers: {
                Authorization:
                  "Bearer token", // put your token
                "Content-Type": "application/json",
              },
            }
          )
          this.output = response.data.link;
          this.input=''
 
        } else {
          this.error = "Invalid URL";
        }
      } catch (error) {
        console.log(error);
        this.error = error.message;
      }
    },  
    async copyOutput() {
      try {
        if(this.output === ''){
          this.error='Enter valid link'
        }
        else{
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(this.output);
            this.message='copied'
          } else {
            var textarea = document.createElement('textarea');
            textarea.value = this.output;
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
              document.execCommand('copy');
              this.message='copied'
            } catch (err) {
              console.error('Could not copy text: ', err);
            }
            document.body.removeChild(textarea);
          }
        }
      } catch (error) {
        console.log("Error copying output link to clipboard: ", error);
      }},    
    async submitted() {
      await this.shortenUrl();
    },
  },
}).mount("#app");
