require("dotenv").config();

function getStaticProps() {
  const Airtable = require("airtable");
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
  const table = base("Table 1");

  console.log(table);
}

getStaticProps()
