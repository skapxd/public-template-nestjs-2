// cSpell Settings
/**@type {import('cspell').FileSettings} */
module.exports = {
  // Version of the setting file.  Always 0.2
  "version": "0.2",
  // language - current active spelling language
  "language": "es,en",
  // words - list of words to be always considered correct
  "words": [
    "mkdirp",
    "tsmerge",
    "githubusercontent",
    "streetsidesoftware",
    "vsmarketplacebadge",
    "visualstudio",
    "luxon",
    "filename",
    "fieldname",
    "originalname",
    "Typeorm",
    "sqlite",
    "typeorm",
    "Streamable",
    "ossp",
    "postgres",
    "timestamptz",
    "Earlyhints",
    "EJSON",
    "Millis"
  ],
  // flagWords - list of words to be always considered incorrect
  // This is useful for offensive words and common spelling errors.
  // For example "hte" should be "the"
  "flagWords": [
    "hte"
  ],
  "ignorePaths": [
    "node_modules/**",
    "**/*.spec.ts",
    "./src/metadata.ts"
  ],
  "import": [
    "./cspell-ext.json"
  ]
}