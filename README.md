# shortme

Create a short slug version from your text input

## Installation

- Run `npm install shortme --save`

## Usage

```JavaScript
const shortme = require("shortme");
const yourShortSlugVersion = shortme("Your Text Input", options)

```

## Options

Options is an Object that helps you to configurate custom settings

```JavaScript
const options = {
    delimiterChar: "", // {String} defines delimiter char sign. Default: "_"
    maxCharLength: 16 // {Number} defines max size of returning output
}

```
