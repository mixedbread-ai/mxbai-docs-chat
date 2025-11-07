# Mixedbread Docs Chat

A Next.js starter template for building AI documentation chatbot using AI SDK and [Mixedbread Search](https://www.mixedbread.com/blog/mixedbread-search).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmixedbread-ai%2Fmxbai-docs-chat&project-name=mxbai-docs-chat&repository-name=mxbai-docs-chat&demo-title=Mixedbread%20Docs%20Chat&demo-description=A%20Next.js%20starter%20template%20for%20building%20AI%20documentation%20chatbot%20using%20Mixedbread%20Search%20and%20AI%20SDK.&demo-url=https%3A%2F%2Fdemo.chat.mixedbread.com&demo-image=https%3A%2F%2Fdemo.chat.mixedbread.com%2Fopengraph-image.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22mixedbread%22%2C%22productSlug%22%3A%22search%22%2C%22protocol%22%3A%22other%22%7D%5D&env=GITHUB_TOKEN&&env=GEMINI_API_KEY&envDescription=Set%20GitHub%20token%20to%20increases%20the%20GitHub%20API%20rate%20limit.&envLink=https%3A%2F%2Fgithub.com%2Fsettings%2Ftokens%2Fnew)

https://github.com/user-attachments/assets/7ee28ede-4527-46f8-ba33-78d574820129

## Getting Started

### Prerequisites

- Bun (or Node.js 22+)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mixedbread-ai/mxbai-docs-chat
cd mxbai-docs-chat
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your credentials to the `.env` file:

```env
MXBAI_API_KEY=your-api-key-here
MXBAI_STORE_ID=your-store-id
GEMINI_API_KEY=your-api-key-here
GITHUB_TOKEN=your-github-token-here
```

**To get your API key and Store ID, you have two options:**

1. **From Vercel Integration** (Recommended if deploying to Vercel):
   - Go to your [Vercel dashboard](https://vercel.com/dashboard)
   - Navigate to your project's **Integrations** tab
   - Install or access the [Mixedbread integration](https://vercel.com/marketplace/mixedbread)
   - Copy your API key and Store ID from the integration settings

2. **From Mixedbread Platform** (For standalone use):
   - Visit the [Mixedbread Platform](https://platform.mixedbread.com/platform?next=api-keys)
   - Sign up or log in to your account
   - Navigate to **API Keys** and create a new key
   - Navigate to **Stores** and create a new Store, then copy the Store ID

### 4. Upload Documentation Files to Store

This script fetches the Next.js documentation from GitHub and uploads it to your Mixedbread Store for semantic search:

```bash
bun ingest-docs
```

> **Note**: If you're on the free plan, your Store has a limit of 100 files. The Next.js documentation exceeds this limit, so not all files will be ingested. The docs chat will not know about files that were not ingested and won't be able to answer questions related to those topics. Consider upgrading your plan or using your own smaller documentation set.

> **Note**: By default, this ingests Next.js documentation from the official repository. See the [Customization](#customization) section below to index your own documentation.

### 5. Run the Application

Start the development server:

```bash
bun dev
```

## Customization

### Using Your Own Documentation

To index your own documentation instead of Next.js docs, modify `scripts/ingest-docs.ts`:

1. **Change the repository settings**:
```typescript
const REPO_OWNER = "your-org";
const REPO_NAME = "your-repo";
const REPO_BRANCH = "main"; // or your default branch
const DOCS_PATH = "docs"; // path to your docs folder
```

2. **Update the source URL construction** in the `constructSourceUrl()` function to match your documentation site structure.

3. **Adjust file extensions** if needed:
```typescript
const VALID_EXTENSIONS = [".md", ".mdx"]; // add other formats if needed
```

4. Run the ingestion script:
```bash
bun ingest-docs
```

### Alternative: Upload Local Documentation Files

If want to upload your local documentation files, you can use the [Mixedbread CLI](https://www.mixedbread.com/cli) to upload them directly to your Store.

### Customizing the LLM Behavior

Edit `app/api/chat/route.ts` to customize:
- **System Prompt**: Modify the `SYSTEM_PROMPT` constant to change the LLM's behavior and instructions
- **Model**: Change the `model` variable if you want to use a different LLM

## Learn More

### Mixedbread Resources

- [Mixedbread Documentation](https://www.mixedbread.com/docs) - Learn about Mixedbread's features and APIs
- [Quickstart Guide](https://www.mixedbread.com/docs/quickstart) - Get started with creating Stores and uploading files
- [Mixedbread Discord](https://discord.gg/fCpaq2dr) - Join the community and get support

## License

This project is licensed under the [MIT License](LICENSE.md).
