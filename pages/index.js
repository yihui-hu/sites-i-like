// index page

import { motion, AnimatePresence } from "framer-motion";
import { createContext, React, useState } from "react";
import {
  InfoLg,
  BrightnessHighFill,
  MoonStarsFill,
} from "react-bootstrap-icons";

export const ThemeContext = createContext(null);

function Home(props) {
  let sites = props.records;

  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }

  const [isModalShown, setIsModalShown] = useState(false);

  function toggleModalShown() {
    setIsModalShown(!isModalShown);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div id={theme}>
        <div className="container">
          <AnimatePresence exitBeforeEnter>
            {isModalShown && (
              <motion.div
                className="modal"
                key="modal"
                initial={{ y: "-30px", opacity: 0 }}
                animate={{ y: "0px", opacity: 1 }}
                exit={{ y: "-30px", opacity: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
              >
                <h1>About</h1>
                <hr></hr>
                <h2>
                  This site hosts a collection of my favourite sites in both
                  content and design. Read more about it here.
                </h2>
                <h1>Colophon</h1>
                <hr></hr>
                <h2>
                  Built with Next.js and Framer Motion, with AirTable for
                  backend API calls.
                </h2>
                <h1>Contact</h1>
                <hr></hr>
                <h2>
                  If you want to chat, or have your featured site removed, let
                  me know on <a href="https://twitter.com/_yihui">Twitter</a> or
                  via email at yyihui.hu @ gmail.com.
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            className="header"
            initial={{ y: "30px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <motion.div
              className="circle"
              onClick={toggleTheme}
              whileHover={{
                y: "-5px",
                boxShadow: "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px",
              }}
              whileTap={{
                y: "0px",
                boxShadow: "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px",
              }}
            >
              {theme === "dark" && (
                <h2>
                  <BrightnessHighFill />
                </h2>
              )}
              {theme === "light" && (
                <h2>
                  <MoonStarsFill />
                </h2>
              )}
            </motion.div>
            <div className="navbar">
              <h2>Sites I Like</h2>
            </div>
            <motion.div
              className="circle"
              onClick={toggleModalShown}
              whileHover={{
                y: "-5px",
                boxShadow: "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px",
              }}
              whileTap={{
                y: "0px",
                boxShadow: "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px",
              }}
            >
              <h2>
                <InfoLg />
              </h2>
            </motion.div>
          </motion.div>
          <div className="flex-container">
            {sites.map((site, i) => {
              return (
                <motion.div
                  className="flex-box"
                  key={site.name}
                  initial={{ y: "30px", opacity: 0 }}
                  animate={{ y: "0px", opacity: 1 }}
                  transition={{ duration: 0.7, type: "spring", delay: i * 0.1 }}
                >
                  <a href={site.name} target="_blank" rel="noreferrer">
                    <motion.img
                      src={site.image}
                      style={{ borderRadius: "5px" }}
                      whileHover={{
                        scale: 1.01,
                        boxShadow:
                          "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px",
                      }}
                      whileTap={{
                        scale: 0.98,
                        boxShadow:
                          "rgba(116, 116, 116, 0.15) 0px 48px 100px 0px",
                      }}
                    />
                  </a>
                  <div className="site-header">
                    <a
                      className="site-header-name"
                      href={site.name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {site.name}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="footer">
            <h2>© 2022 / Hu Yihui</h2>
            <h2>
              All sites and images featured are © their respective owners.
            </h2>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export async function getServerSideProps() {
  const Airtable = require("airtable");
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
  const table = base("Sites");
  let records = await table
    .select({ sort: [{ field: "Date", direction: "desc" }] })
    .all();

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
