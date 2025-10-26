# Mixedbread Docs Chat

A starter template for building AI documentation chatbot using AI SDK and [Mixedbread Search](https://www.mixedbread.com/blog/mixedbread-search).

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

Run this script to upload all Next.js documentation files to your Mixedbread Store:

```bash
bun ingest-docs
```

### 5. Run the Application

Start the development server:

```bash
bun dev
```

## Learn More

### Mixedbread Resources

- [Mixedbread Documentation](https://www.mixedbread.com/docs) - Learn about Mixedbread's features and APIs
- [Quickstart Guide](https://www.mixedbread.com/docs/quickstart) - Get started with creating Stores and uploading files
- [Mixedbread Discord](https://discord.gg/fCpaq2dr) - Join the community and get support
