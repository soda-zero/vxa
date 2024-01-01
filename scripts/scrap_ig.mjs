import axios from "axios";
import fs from "fs";
import path from "path";

/**
 * @typedef {Object} Dimensions - The dimensions of the Instagram post image.
 * @property {number} height - The height of the image.
 * @property {number} width - The width of the image.
 *
 * @typedef {Object} Post - Instagram post data.
 * @property {string} id - The unique identifier of the post.
 * @property {string} title - The title of the post.
 * @property {string} tags - The tags associated with the post.
 * @property {number} created_at - The timestamp when the post was created.
 * @property {string} shortcode - The shortcode of the post.
 * @property {Dimensions} dimensions - The dimensions of the post's image.
 * @property {string} img_src - The source path of the post's image.
 * @property {boolean} [ignore] - Optional field indicating whether the post should be ignored.
 */

const INSTAGRAM_APP_ID = "936619743392459";

// async function scrape_user(username: string): Promise<any> {
//   const headers = {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
//     "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
//     "Accept-Encoding": "gzip, deflate, br",
//     Accept: "*/*",
//     "x-ig-app-id": INSTAGRAM_APP_ID,
//   };
//
//   try {
//     const response = await axios.get(
//       `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
//       { headers },
//     );
//     return response.data.data.user;
//   } catch (error) {
//     console.error("Error: ", error.message);
//     throw error;
//   }
// }

/**
 * Scrapes an Instagram post using its URL or shortcode.
 *
 * @param {string} urlOrShortcode - The URL or shortcode of the Instagram post.
 * @returns {Promise<Object>} - A promise that resolves to the scraped data of the Instagram post.
 */
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
    url + encodeURIComponent(JSON.stringify(variables)),
    {
      headers: {
        "x-ig-app-id": INSTAGRAM_APP_ID,
      },
    },
  );

  const data = result.data;
  return data.data.shortcode_media;
}

/**
 * Scrapes the User Instagram posts using its ID.
 *
 * @param {string} user_id - The user ID on IG.
 * @param {number} page_size - The number of Posts to retrieve.
 *
 * @returns {Promise<void>} - A promise that resolves when the scraping is complete.
 */
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
    try {
      const response = await axios.get(url);
      if (response.ok) {
        const data = response.data;
        const posts = data.data.user.edge_owner_to_timeline_media;

        for (const post of posts.edges) {
          const parsedPost = parse_instagram_post(post.node);
          if (post.node.is_video === false) {
            parsedPosts.push(parsedPost);
          }
        }

        const page_info = posts.page_info;

        if (_page_number === 1) {
          console.log(`scraping total ${posts.count} posts of ${user_id}`);
        } else {
          console.log(`scraping page ${_page_number}`);
        }

        if (!page_info.has_next_page || parsedPosts.length >= 21) {
          break;
        }

        if (variables.after === page_info.end_cursor) {
          break;
        }

        variables.after = page_info.end_cursor;
        _page_number++;
      } else {
        throw Error("The fetch failed omegalul");
      }
    } catch (error) {
      console.error("Error while scraping:", error);
      break;
    }
  }
}

/**
 * Downloads an image from the specified URL and saves it to the destination path.
 *
 * @param {string} url - The URL of the image to download.
 * @param {string} dest - The destination path where the image will be saved.
 *
 * @returns {Promise<void>} - A promise that resolves when the image is successfully downloaded and saved.
 * @throws {Error} - If there is an error during the download or saving process.
 *
 */
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

/**
 * Parses an Instagram post and performs various actions, including downloading an image.
 *
 * @param {Post} data - The Instagram post data to be parsed.
 * @returns {void} - The function doesn't return a value directly; it performs asynchronous actions.
 *
 * @throws {Error} - If there is an error during the download or file operations.
 *
 */
function parse_instagram_post(data) {
  const imageDir = "../public/images";
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }

  if (data.is_video === false) {
    const imageUrl = data.display_url;
    const imageFileName = `${data.shortcode}.jpg`;
    const imageFilePath = path.join(imageDir, imageFileName);

    const captions = data.edge_media_to_caption.edges.map(
      (edge) => edge.node.text,
    );

    let title = "";
    const tags = [];

    if (captions.length > 0) {
      const firstCaption = captions[0];
      const firstHashIndex = firstCaption.indexOf("#");
      if (firstHashIndex !== -1) {
        title = firstCaption.substring(0, firstHashIndex).trim(); // Extract text before the first "#"
        const remainingCaption = firstCaption.substring(firstHashIndex);

        // Extract tags from the remaining part of the caption
        const tagMatches = remainingCaption.match(/#(\w+)/g);
        if (tagMatches) {
          tags.push(...tagMatches.map((tag) => tag.substring(1))); // Extract tags without the #
        }
      } else {
        // If there is no "#" symbol, use the whole caption as the title
        title = firstCaption;
      }
    }
    downloadImage(imageUrl, imageFilePath)
      .then(() => {
        if (!fs.existsSync(imageFilePath)) {
          console.log(`Image downloaded and saved to ${imageFilePath}`);
        } else {
          console.log(`Image already exists at ${imageFilePath}`);
        }

        const parsedData = {
          id: data.id,
          title: title,
          tags: tags.join(" "),
          shortcode: data.shortcode,
          created_at: data.taken_at_timestamp,
          dimensions: data.dimensions,
          img_src: `/images/${imageFileName}`, // Set img_src to the downloaded image path
        };

        // Write the parsed data to a JavaScript file
        const types = `
export type Posts = Post[];
export interface Post {
    id: string;
    title: string,
    tags: string;
    created_at: number;
    shortcode: string;
    dimensions: Dimensions;
    img_src: string;
    ignore?: boolean;
}

export interface Dimensions {
    height: number;
    width: number;
}
`;

        const types_folder = "../src/types";
        const data_folder = "../src/data";

        if (!fs.existsSync(types_folder)) {
          fs.mkdirSync(types_folder);
        }

        if (!fs.existsSync(data_folder)) {
          fs.mkdirSync(data_folder);
        }
        // Read the existing data from the data file
        const dataFilePath = "../src/data/posts_data.json";

        if (fs.existsSync(dataFilePath)) {
          fs.readFile(dataFilePath, "utf8", (err, dataFromFile) => {
            if (err) {
              console.error(`Error reading existing data: ${err.message}`);
              return;
            }

            // Parse the existing data
            /** @type {Post[]} */
            const existingPosts = JSON.parse(
              dataFromFile.slice(dataFromFile.indexOf("[")),
            );
            // Check if a post with the same shortcode exists
            const existingPostIndex = existingPosts.findIndex(
              (post) => post.shortcode === parsedData.shortcode,
            );
            if (existingPostIndex === -1) {
              // Append the new post data
              existingPosts.push(parsedData);

              // Update the posts_data variable
              const updatedPostsData = `${JSON.stringify(
                existingPosts,
                null,
                2,
              )}`;
              // Write the updated data back to the file
              fs.writeFile(dataFilePath, updatedPostsData, (err) => {
                if (err) {
                  console.error(`Error writing updated data: ${err.message}`);
                } else {
                  console.log("New post added and data updated.");
                }
              });
            }
          });
        } else {
          // Create a new 'posts_data.json' file with the initial data
          const initialData = `[${JSON.stringify(parsedData, null, 2)}]`;

          fs.writeFileSync(dataFilePath, initialData);
          console.log("New data file created with the initial post data.");
        }
        fs.writeFileSync("../src/types/posts.ts", types);
      })
      .catch((error) => {
        console.error(`Error downloading image: ${error.message}`);
      });
  }
}

/**
 * Parses Instagram user data.
 *
 * @param {Object} data - Instagram user data.
 * @property {string} data.full_name - The full name of the user.
 * @property {string} data.username - The username of the user.
 * @property {string} data.id - The ID of the user.
 * @property {string} data.biography - The biography of the user.
 * @property {Array<Object>} data.bio_links - An array of objects representing bio links, each having a 'url' property.
 * @property {string} data.external_url - The external URL of the user's homepage.
 * @property {string} data.profile_pic_url_hd - The URL of the user's high-definition profile image.
 *
 * @returns {Object} - The parsed user data.
 * @property {string} name - The full name of the user.
 * @property {string} username - The username of the user.
 * @property {string} id - The ID of the user.
 * @property {string} bio - The biography of the user.
 * @property {Array<string>} bio_links - An array of bio links.
 * @property {string} homepage - The external URL of the user's homepage.
 * @property {string} profile_image - The URL of the user's high-definition profile image.
 *
 */
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

// const post = await scrape_post("Cxy9i1lLXBP");
scrape_user_posts("6877920009");
// parse_instagram_post(post);
