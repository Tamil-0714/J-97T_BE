import { WEB_HISTORY_ROUTE_PATHS } from "@/api/webHistory/webHistory.routes";
import { API_PATHS } from "@/common/utils/api.paths";
import { env } from "@/config/envConfig";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = new URL(
  `${API_PATHS.BASE}${WEB_HISTORY_ROUTE_PATHS.FILTER_WEB_HISTORY}`,
  `${env.HOST}:${env.PORT}`
).toString();

console.log({API_URL});


const AUTH_TOKEN = env.SECRET_TOKEN; 

// Some sample filter test cases
const filterTests = [
  // 1. OR condition with multiple fields
  {
    operator: "OR",
    conditions: [
      {
        field: "email",
        operator: "in",
        value: ["tamilarasan@google.com"]
      },
      {
        field: "query",
        operator: "contains",
        value: "javascript"
      },
      {
        field: "domain",
        operator: "ends_with",
        value: ".com"
      }
    ],
    limit: 50,
    sort_by: "created_at",
    sort_order: "desc"
  },

  // 2. AND condition: specific profile + query contains
  {
    operator: "AND",
    conditions: [
      {
        field: "profile",
        operator: "equals",
        value: "personal_tamil"
      },
      {
        field: "query",
        operator: "contains",
        value: "typescript"
      }
    ],
    limit: 10
  },

  // 3. Find by domain starts_with
  {
    conditions: [
      {
        field: "domain",
        operator: "starts_with",
        value: "google"
      }
    ],
    sort_by: "created_at",
    sort_order: "asc"
  },

  // 4. Only email filter
  {
    conditions: [
      {
        field: "email",
        operator: "equals",
        value: "tamil.tj.1967@gmail.com"
      }
    ],
    limit: 20
  }
];

async function testFilters() {
  for (const [i, filter] of filterTests.entries()) {
    try {
      console.log(`\n--- Running filter test #${i + 1} ---`);
      const res = await axios.post(
        API_URL,
        filter,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`
          }
        }
      );
      console.log("Response:", JSON.stringify({data: res.data, filter}, null, 2));
      console.log("----------------------------------------------------------------");
    } catch (err:any) {
      console.error("Error in test #", i + 1, err.response?.data || err.message);
    }
  }
}

testFilters();


/**
 * ## Sample response 
 * 
 ```json
 --- Running filter test #1 ---
Response: {
  "data": {
    "success": true,
    "message": "History records fetched successfully",
    "responseObject": {
      "records": [
        {
          "id": "6",
          "email": "tamil.tj.1967@gmail.com",
          "profile": "personal_tamil",
          "search_type": "direct_visit",
          "query": null,
          "url": "https://twitter.com",
          "domain": "twitter.com",
          "created_at": "2025-09-06T11:53:41.848Z"
        },
        {
          "id": "5",
          "email": "tamilarasan@google.com",
          "profile": "work",
          "search_type": "google_search",
          "query": "typescript axios example",
          "url": "https://www.google.com/search?q=typescript+axios+example",
          "domain": "google.com",
          "created_at": "2025-09-06T11:53:41.677Z"
        },
        {
          "id": "4",
          "email": "tommy.97@gmail.com",
          "profile": "personal_tom",
          "search_type": "direct_visit",
          "query": null,
          "url": "https://news.ycombinator.com",
          "domain": "ycombinator.com",
          "created_at": "2025-09-06T11:53:41.505Z"
        },
        {
          "id": "3",
          "email": "tamilarasan@google.com",
          "profile": "work",
          "search_type": "google_search",
          "query": "zod schema tutorial",
          "url": "https://www.google.com/search?q=zod+schema+tutorial",
          "domain": "google.com",
          "created_at": "2025-09-06T11:53:41.411Z"
        },
        {
          "id": "2",
          "email": "tamil.tj.1967@gmail.com",
          "profile": "personal_tamil",
          "search_type": "direct_visit",
          "query": null,
          "url": "https://github.com",
          "domain": "github.com",
          "created_at": "2025-09-06T11:53:41.177Z"
        }
      ],
      "total": 5,
      "limit": 50,
      "offset": 0
    },
    "statusCode": 200
  },
  "filter": {
    "operator": "OR",
    "conditions": [
      {
        "field": "email",
        "operator": "in",
        "value": [
          "tamilarasan@google.com"
        ]
      },
      {
        "field": "query",
        "operator": "contains",
        "value": "javascript"
      },
      {
        "field": "domain",
        "operator": "ends_with",
        "value": ".com"
      }
    ],
    "limit": 50,
    "sort_by": "created_at",
    "sort_order": "desc"
  }
}
----------------------------------------------------------------

--- Running filter test #2 ---
Response: {
  "data": {
    "success": true,
    "message": "History records fetched successfully",
    "responseObject": {
      "records": [],
      "total": 0,
      "limit": 10,
      "offset": 0
    },
    "statusCode": 200
  },
  "filter": {
    "operator": "AND",
    "conditions": [
      {
        "field": "profile",
        "operator": "equals",
        "value": "personal_tamil"
      },
      {
        "field": "query",
        "operator": "contains",
        "value": "typescript"
      }
    ],
    "limit": 10
  }
}
----------------------------------------------------------------

--- Running filter test #3 ---
Response: {
  "data": {
    "success": true,
    "message": "History records fetched successfully",
    "responseObject": {
      "records": [
        {
          "id": "3",
          "email": "tamilarasan@google.com",
          "profile": "work",
          "search_type": "google_search",
          "query": "zod schema tutorial",
          "url": "https://www.google.com/search?q=zod+schema+tutorial",
          "domain": "google.com",
          "created_at": "2025-09-06T11:53:41.411Z"
        },
        {
          "id": "5",
          "email": "tamilarasan@google.com",
          "profile": "work",
          "search_type": "google_search",
          "query": "typescript axios example",
          "url": "https://www.google.com/search?q=typescript+axios+example",
          "domain": "google.com",
          "created_at": "2025-09-06T11:53:41.677Z"
        }
      ],
      "total": 2,
      "limit": 100,
      "offset": 0
    },
    "statusCode": 200
  },
  "filter": {
    "conditions": [
      {
        "field": "domain",
        "operator": "starts_with",
        "value": "google"
      }
    ],
    "sort_by": "created_at",
    "sort_order": "asc"
  }
}
----------------------------------------------------------------

--- Running filter test #4 ---
Response: {
  "data": {
    "success": true,
    "message": "History records fetched successfully",
    "responseObject": {
      "records": [
        {
          "id": "1",
          "email": "tamil.tj.1967@gmail.com",
          "profile": "personal_tamil",
          "search_type": "direct_visit",
          "query": null,
          "url": "https://www.github.com",
          "domain": null,
          "created_at": "2025-09-06T11:46:44.717Z"
        },
        {
          "id": "2",
          "email": "tamil.tj.1967@gmail.com",
          "profile": "personal_tamil",
          "search_type": "direct_visit",
          "query": null,
          "url": "https://github.com",
          "domain": "github.com",
          "created_at": "2025-09-06T11:53:41.177Z"
        },
        {
          "id": "6",
          "email": "tamil.tj.1967@gmail.com",
          "profile": "personal_tamil",
          "search_type": "direct_visit",
          "query": null,
          "url": "https://twitter.com",
          "domain": "twitter.com",
          "created_at": "2025-09-06T11:53:41.848Z"
        }
      ],
      "total": 3,
      "limit": 20,
      "offset": 0
    },
    "statusCode": 200
  },
  "filter": {
    "conditions": [
      {
        "field": "email",
        "operator": "equals",
        "value": "tamil.tj.1967@gmail.com"
      }
    ],
    "limit": 20
  }
}
----------------------------------------------------------------


```
 */