import Mixedbread from "@mixedbread/sdk";
import matter from "gray-matter";
import pLimit from "p-limit";

interface GitHubTreeResponse {
  tree: Array<{
    path?: string;
    type?: string;
  }>;
}

const REPO_OWNER = "vercel";
const REPO_NAME = "next.js";
const REPO_BRANCH = "canary";
const DOCS_PATH = "docs";
const VALID_EXTENSIONS = [".md", ".mdx"];

const mxbai = new Mixedbread({
  apiKey: process.env.MXBAI_API_KEY,
});

function constructSourceUrl(path: string) {
  let urlPath = path;

  // Remove numeric prefixes like '01-', '03-' from each segment
  urlPath = urlPath
    .split("/")
    .map((segment) => {
      return segment.replace(/^\d+-/, "");
    })
    .join("/");

  urlPath = urlPath.replace(/\.(md|mdx)$/, "");

  return `https://nextjs.org/${urlPath}`;
}

function getGitHubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "mxbai-docs-chat",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  return headers;
}

async function getRepoTree(
  owner: string,
  repo: string,
  branch: string,
): Promise<GitHubTreeResponse | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: getGitHubHeaders() },
  );

  if (!response.ok) {
    if (response.status === 404) {
      console.error(`✗ Branch '${branch}' not found`);
      return null;
    }
    if (response.status === 403) {
      console.error(
        `✗ GitHub API rate limit exceeded. ${
          process.env.GITHUB_TOKEN
            ? "Try again later."
            : "Add a GITHUB_TOKEN to your .env for higher limits."
        }`,
      );
      return null;
    }
    console.error(`✗ Failed to fetch tree: ${response.statusText}`);
    return null;
  }

  return await response.json();
}

async function getFileContent(
  owner: string,
  repo: string,
  path: string,
): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    {
      headers: {
        ...getGitHubHeaders(),
        Accept: "application/vnd.github.raw+json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      console.error(
        `✗ GitHub API rate limit exceeded. ${
          process.env.GITHUB_TOKEN
            ? "Try again later."
            : "Add a GITHUB_TOKEN to your .env for higher limits."
        }`,
      );
      return null;
    }
    return null;
  }

  return await response.text();
}

async function checkStoreFiles(storeId: string): Promise<number> {
  try {
    const store = await mxbai.stores.retrieve(storeId);
    return store.file_counts?.total || 0;
  } catch (error) {
    console.error(
      `⚠  Failed to check store: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return 0;
  }
}

async function uploadToStore(
  storeId: string,
  files: Array<{ path: string; content: string }>,
) {
  console.log(`📤 Uploading ${files.length} files to store...`);

  const limit = pLimit(100);
  let uploadedCount = 0;
  let failedCount = 0;

  await Promise.all(
    files.map((file) =>
      limit(async () => {
        try {
          const parsed = matter(file.content);

          const blob = new Blob([file.content], { type: "text/markdown" });
          const filename = file.path.split("/").pop() || "file.mdx";
          const fileObj = new File([blob], filename, { type: "text/markdown" });

          await mxbai.stores.files.uploadAndPoll({
            storeIdentifier: storeId,
            file: fileObj,
            body: {
              metadata: {
                source_url: constructSourceUrl(file.path),
                ...parsed.data,
              },
            },
          });

          uploadedCount++;

          if (uploadedCount % 10 === 0 || uploadedCount === files.length) {
            console.log(`  Uploaded ${uploadedCount}/${files.length} files...`);
          }
        } catch (error) {
          failedCount++;
          console.error(
            `⚠  Failed to upload ${file.path}: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }),
    ),
  );

  console.log(
    `✓ Upload complete! ${uploadedCount} uploaded, ${failedCount} failed.`,
  );
}

async function main() {
  console.log("🚀 Starting documentation ingestion...\n");

  if (!process.env.MXBAI_API_KEY) {
    console.error("✗ MXBAI_API_KEY environment variable is not set");
    console.log("Please add MXBAI_API_KEY to your .env file");
    process.exit(1);
  }

  if (!process.env.MXBAI_STORE_ID) {
    console.error("✗ MXBAI_STORE_ID environment variable is not set");
    console.log("Please add MXBAI_STORE_ID to your .env file");
    process.exit(1);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error("✗ GITHUB_TOKEN environment variable is not set");
    console.log("Please add GITHUB_TOKEN to your .env file");
    process.exit(1);
  }

  const storeId = process.env.MXBAI_STORE_ID;

  // Check if store already has files
  console.log("🔍 Checking store status...");
  const fileCount = await checkStoreFiles(storeId);

  if (fileCount > 0) {
    console.log(`✓ Store already contains ${fileCount} files`);
    console.log("ℹ️  Skipping ingestion to avoid duplicates.\n");
    process.exit(0);
  }

  console.log("✓ Store is empty, proceeding with ingestion\n");

  console.log(
    `📥 Fetching docs from ${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${DOCS_PATH}...`,
  );

  const tree = await getRepoTree(REPO_OWNER, REPO_NAME, REPO_BRANCH);
  if (!tree) {
    process.exit(1);
  }

  const docFiles = tree.tree.filter((item) => {
    if (item.type !== "blob" || !item.path) return false;
    if (!item.path.startsWith(`${DOCS_PATH}/`)) return false;
    return VALID_EXTENSIONS.some((ext) => item.path?.endsWith(ext));
  });

  console.log(`✓ Found ${docFiles.length} documentation files\n`);

  if (docFiles.length === 0) {
    console.log("⚠  No documentation files found");
    process.exit(0);
  }

  console.log("📖 Downloading file contents...");
  const limit = pLimit(30);
  let downloadedCount = 0;

  const results = await Promise.all(
    docFiles.map((file) =>
      limit(async () => {
        if (!file.path) return null;

        const content = await getFileContent(REPO_OWNER, REPO_NAME, file.path);
        if (!content) {
          console.warn(`⚠  Skipping ${file.path}`);
          return null;
        }

        downloadedCount++;
        if (downloadedCount % 10 === 0 || downloadedCount === docFiles.length) {
          console.log(
            `  Downloaded ${downloadedCount}/${docFiles.length} files...`,
          );
        }

        return { path: file.path, content };
      }),
    ),
  );

  const filesWithContent = results.filter((result) => result !== null);

  if (filesWithContent.length === 0) {
    console.error("✗ No files were successfully downloaded");
    process.exit(1);
  }

  console.log(`✓ Downloaded ${filesWithContent.length} files\n`);

  await uploadToStore(storeId, filesWithContent);

  console.log("\n✨ Success! Documentation has been ingested.");
}

main();
