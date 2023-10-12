import axios from "axios";
import fs from "fs";
import path from "path";

export interface Root {
  data: Data;
  extensions: Extensions;
  status: string;
}

export interface Data {
  user: User;
}

export interface User {
  edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
}

export interface EdgeOwnerToTimelineMedia {
  count: number;
  page_info: PageInfo;
  edges: Edge[];
}

export interface PageInfo {
  has_next_page: boolean;
  end_cursor: string;
}

export interface Edge {
  node: Post;
}

export interface Post {
  __typename: string;
  id: string;
  dimensions: Dimensions;
  display_url: string;
  display_resources: DisplayResource[];
  is_video: boolean;
  tracking_token: string;
  edge_media_to_tagged_user: EdgeMediaToTaggedUser;
  dash_info?: DashInfo;
  video_url?: string;
  video_view_count?: number;
  edge_media_to_caption: EdgeMediaToCaption;
  shortcode: string;
  edge_media_to_comment: EdgeMediaToComment;
  edge_media_to_sponsor_user: EdgeMediaToSponsorUser;
  comments_disabled: boolean;
  taken_at_timestamp: number;
  edge_media_preview_like: EdgeMediaPreviewLike;
  gating_info: any;
  fact_check_overall_rating: any;
  fact_check_information: any;
  media_preview?: string;
  owner: Owner2;
  location: any;
  viewer_has_liked: boolean;
  viewer_has_saved: boolean;
  viewer_has_saved_to_collection: boolean;
  viewer_in_photo_of_you: boolean;
  viewer_can_reshare: boolean;
  thumbnail_src: string;
  thumbnail_resources: ThumbnailResource[];
  accessibility_caption: any;
  edge_sidecar_to_children?: EdgeSidecarToChildren;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface DisplayResource {
  src: string;
  config_width: number;
  config_height: number;
}

export interface EdgeMediaToTaggedUser {
  edges: any[];
}

export interface DashInfo {
  is_dash_eligible: boolean;
  video_dash_manifest: string;
  number_of_qualities: number;
}

export interface EdgeMediaToCaption {
  edges: Edge2[];
}

export interface Edge2 {
  node: Node2;
}

export interface Node2 {
  text: string;
}

export interface EdgeMediaToComment {
  count: number;
  page_info: PageInfo2;
  edges: Edge3[];
}

export interface PageInfo2 {
  has_next_page: boolean;
  end_cursor?: string;
}

export interface Edge3 {
  node: Node3;
}

export interface Node3 {
  id: string;
  text: string;
  created_at: number;
  did_report_as_spam: boolean;
  owner: Owner;
  viewer_has_liked: boolean;
}

export interface Owner {
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}

export interface EdgeMediaToSponsorUser {
  edges: any[];
}

export interface EdgeMediaPreviewLike {
  count: number;
  edges: Edge4[];
}

export interface Edge4 {
  node: Node4;
}

export interface Node4 {
  id: string;
  profile_pic_url: string;
  username: string;
}

export interface Owner2 {
  id: string;
  username: string;
}

export interface ThumbnailResource {
  src: string;
  config_width: number;
  config_height: number;
}

export interface EdgeSidecarToChildren {
  edges: Edge5[];
}

export interface Edge5 {
  node: Node5;
}

export interface Node5 {
  __typename: string;
  id: string;
  dimensions: Dimensions2;
  display_url: string;
  display_resources: DisplayResource2[];
  is_video: boolean;
  tracking_token: string;
  edge_media_to_tagged_user: EdgeMediaToTaggedUser2;
  accessibility_caption: any;
}

export interface Dimensions2 {
  height: number;
  width: number;
}

export interface DisplayResource2 {
  src: string;
  config_width: number;
  config_height: number;
}

export interface EdgeMediaToTaggedUser2 {
  edges: any[];
}

export interface Extensions {
  is_final: boolean;
}

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

async function scrape_post(urlOrShortcode: string) {
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

// Last time was page 70
async function scrape_user_posts(user_id: string, page_size = 12) {
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

      if (!page_info.has_next_page) {
        break;
      }

      if (variables.after === page_info.end_cursor) {
        break;
      }

      variables.after = page_info.end_cursor;
      _page_number++;
    } catch (error) {
      console.error("Error while scraping:", error);
      break;
    }
  }
}

async function downloadImage(
  url: string,
  dest: string,
): Promise<Root | undefined> {
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

function parse_instagram_post(data: Post) {
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
    const tags: string[] = [];

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
            const existingPosts = JSON.parse(
              dataFromFile.slice(dataFromFile.indexOf("[")),
            );
            // Check if a post with the same shortcode exists
            const existingPostIndex = existingPosts.findIndex(
              (post: typeof parsedData) =>
                post.shortcode === parsedData.shortcode,
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

function parseUser(data: any) {
  const parsedData = {
    name: data.full_name,
    username: data.username,
    id: data.id,
    bio: data.biography,
    bio_links: (data.bio_links || []).map((link: any) => link.url),
    homepage: data.external_url,
    profile_image: data.profile_pic_url_hd,
  };

  return parsedData;
}

// const post = await scrape_post("Cxy9i1lLXBP");
scrape_user_posts("6877920009");
// parse_instagram_post(post);
