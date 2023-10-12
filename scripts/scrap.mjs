import axios from "axios";
import fs from "fs";
import path from "path";

const INSTAGRAM_APP_ID = "936619743392459";

async function scrape_user(username) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    Accept: "*/*",
    "x-ig-app-id": INSTAGRAM_APP_ID,
  };

  try {
    const response = await axios.get(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      { headers },
    );
    return response.data.data.user;
  } catch (error) {
    console.error("Error: ", error.message);
  }
}
async function scrape_post(urlOrShortcode) {
  let shortcode = urlOrShortcode;

  if (urlOrShortcode.includes("http")) {
    shortcode = urlOrShortcode.split("/p/")[1].split("/")[0];
  }

  console.log(`scraping instagram post: ${shortcode}`);

  const variables = {
    shortcode: shortcode,
    child_comment_count: 20,
    fetch_comment_count: 100,
    parent_comment_count: 24,
    has_threaded_comments: true,
  };

  const url =
    "https://www.instagram.com/graphql/query/?query_hash=b3055c01b4b222b8a47dc12b090e4e64&variables=";

  const result = await axios.get(
    url +
      encodeURIComponent(JSON.stringify(variables), {
        headers: {
          "x-ig-app-id": INSTAGRAM_APP_ID,
        },
      }),
  );

  console.log(
    url +
      encodeURIComponent(JSON.stringify(variables), {
        headers: {
          "x-ig-app-id": INSTAGRAM_APP_ID,
        },
      }),
  );
  const data = result.data;
  console.log(data);
  return data.data.shortcode_media;
}

async function scrape_user_posts(user_id, page_size = 12) {
  const base_url =
    "https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables=";
  let variables = {
    id: user_id,
    first: page_size,
    after: null,
  };
  let _page_number = 1;

  const parsedPosts = [];
  while (true) {
    const url = `${base_url}${encodeURIComponent(JSON.stringify(variables))}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      const data = response.data;
      const posts = data.data.user.edge_owner_to_timeline_media;

      for (const post of posts.edges) {
        const parsedPost = parse_instagram_post(post.node);
        if (parsedPost.is_video === false) {
          parsedPosts.push(parsedPost);
        }
      }

      const page_info = posts.page_info;

      if (_page_number === 1) {
        console.log(`scraping total ${posts.count} posts of ${user_id}`);
      } else {
        console.log(`scraping page ${_page_number}`);
      }

      if (!page_info.has_next_page) {
        break;
      }

      if (variables.after === page_info.end_cursor) {
        break;
      }

      variables.after = page_info.end_cursor;
      _page_number++;
      console.log(url);
    } catch (error) {
      console.log(url);
      console.error("Error while scraping:", error);
      break;
    }
  }

  // Write the parsed post data to a JSON file
  const jsonFileName = "parsed_posts.json";
  fs.writeFileSync(jsonFileName, JSON.stringify(parsedPosts, null, 2));
  console.log(`Parsed post data written to ${jsonFileName}`);
}

async function downloadImage(url, dest) {
  const writer = fs.createWriteStream(dest);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

function parse_instagram_post(data) {
  // Create a folder for images
  const imageDir = "../public/images";
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }

  // Sanitize the image filename
  const imageUrl = data.display_url;
  const imageFileName = `${data.shortcode}.jpg`;
  const imageFilePath = path.join(imageDir, imageFileName);

  downloadImage(imageUrl, imageFilePath)
    .then(() => {
      console.log(`Image downloaded and saved to ${imageFilePath}`);

      const parsedData = {
        id: data.id,
        shortcode: data.shortcode,
        dimensions: data.dimensions,
        img_src: imageFilePath, // Set img_src to the downloaded image path
        is_video: data.is_video,
        captions: data.edge_media_to_caption.edges.map(
          (edge) => edge.node.text,
        ),
      };

      // Write the parsed data to a JavaScript file
      const jsData = `export type Posts = Post[];
                        export interface Post {
                          id: string;
                          shortcode: string;
                          dimensions: Dimensions;
                          display_url: string;
                          is_video: boolean;
                          captions: string[];
                    }

export interface Dimensions {
  height: number;
  width: number;
}

export const posts: Posts = ${JSON.stringify(
        parsedData,
        null,
        2,
      )};\nmodule.exports = parsedData;`;
      fs.writeFileSync("../src/types/data.ts", jsData);
    })
    .catch((error) => {
      console.error(`Error downloading image: ${error.message}`);
    });
}

function parseUser(data) {
  const parsedData = {
    name: data.full_name,
    username: data.username,
    id: data.id,
    bio: data.biography,
    bio_links: (data.bio_links || []).map((link) => link.url),
    homepage: data.external_url,
    profile_image: data.profile_pic_url_hd,
  };

  return parsedData;
}

// scrape_user_posts("6877920009");
const post = await scrape_post("Cwyh700LPvy");
parse_instagram_post(post);

