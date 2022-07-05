// index page

import { motion } from "framer-motion";

function Home(props) {
  console.log(props);

  let sites = props.records;

  return (
    <div className="container">
      <div className="navbar">
        <h2>Sites I Like</h2>
      </div>
      <div className="flex-container">
      {sites.map((site) => {
        return (
          <div className="flex-box" key={site.name}>
            <a href={site.name} target="_blank" rel="noreferrer">
              <motion.img 
                src={site.image}
                style={{ borderRadius: "5px" }}
                whileHover={{ scale: 1.01, boxShadow: "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px"}}
                whileTap={{ scale: 0.98, boxShadow: "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px"}}/>
            </a>
            <div className="site-header">
              <a className="site-header-name" href={site.name} target="_blank" rel="noreferrer">{site.name}</a>
              <h3 className="site-header-date">{new Date(site.date).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</h3>
            </div>
          </div>
        );
      })}
      </div>
      <div className="footer">
        <h2>© 2022 / Hu Yihui.</h2>
        <h2>All sites and images featured are © their respective owners.</h2>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const Airtable = require("airtable");
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
  const table = base("Sites");
  let records = await table.select({sort: [{ field: "Date", direction: "desc"}]}).all();

  records = await Promise.all(
    records.map(async ({ fields }) => {
      return {
        name: fields.Name,
        date: fields.Date,
        image: fields.Attachments[0].thumbnails.large.url,
      };
    })
  );

  return { props: { records } };
}

export default Home;
