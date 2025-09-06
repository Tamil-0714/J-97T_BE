import { WEB_HISTORY_BASE_PATH, WEB_HISTORY_ROUTE_PATHS } from "@/api/webHistory/webHistory.routes";
import { API_PATHS } from "@/common/utils/api.paths";
import { env } from "@/config/envConfig";

import axios from "axios";

const API_URL = new URL(
  `${API_PATHS.BASE}${WEB_HISTORY_ROUTE_PATHS.CREATE_WEB_HISTORY}`,
  `${env.HOST}:${env.PORT}`
).toString();


const AUTH_TOKEN = env.SECRET_TOKEN; 

const dummyData = [
  {
    email: "tamil.tj.1967@gmail.com",
    profile: "personal_tamil",
    searchType: "google_search",
    query:"Best front end js animation library",
    url: "https://www.google.com/search?q=Best+front+end+js+animation+library",
    domain: "google.com"
  },
  // {
  //   email: "tamilarasan@google.com",
  //   profile: "work",
  //   searchType: "google_search",
  //   query: "zod schema tutorial",
  //   url: "https://www.google.com/search?q=zod+schema+tutorial",
  //   domain: "google.com"
  // },
  // {
  //   email: "tommy.97@gmail.com",
  //   profile: "personal_tom",
  //   searchType: "direct_visit",
  //   url: "https://news.ycombinator.com",
  //   domain: "ycombinator.com"
  // },
  // {
  //   email: "tamilarasan@google.com",
  //   profile: "work",
  //   searchType: "google_search",
  //   query: "typescript axios example",
  //   url: "https://www.google.com/search?q=typescript+axios+example",
  //   domain: "google.com"
  // },
  // {
  //   email: "tamil.tj.1967@gmail.com",
  //   profile: "personal_tamil",
  //   searchType: "direct_visit",
  //   url: "https://twitter.com",
  //   domain: "twitter.com"
  // }
];

async function insertDummyData() {
  for (const entry of dummyData) {
    try {
      const res = await axios.post(
        API_URL,
        entry,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`
          }
        }
      );
      console.log("Inserted:", res.data);
    } catch (err: any) {
      console.error("Error inserting:", entry, err.response?.data || err.message);
    }
  }
}

insertDummyData();
