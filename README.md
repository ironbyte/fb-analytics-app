# Moncy's FB Analytics App

## Tech Stack

- [Clerk](https://clerk.com/)
- [Remix](https://remix.run)
- [SST ION](https://ion.sst.dev/) (For deploying the app to AWS)
- [shadcn/ui](https://ui.shadcn.com/) (for the UI components)
- Tailwind CSS

## Setup (Linux)

1. Install SST ION CLI

```sh
curl -fsSL https://ion.sst.dev/install | bash
```

2. Set up social connection with Facebook for the App on Clerk -> [Clerk Docs](https://docs.clerk.dev/guides/social/facebook). Make sure to set all the scopes required for the app to work correctly

```sh
email
read_insights
pages_show_list
pages_read_engagement
pages_manage_metadata
pages_read_user_content
pages_manage_engagement
```

3. Set up the mandatory Clerk secrets with SST ION CLI

```sh
sst secret set ClerkSecretKey [YOUR_CLERK_SECRET_KEY]
sst secret set ClerkPublishableKey [YOUR_CLERK_PUBLISHABLE_KEY]
```

Verify that the secrets are set correctly

```sh
sst secret list
```

4. Run the app locally

```sh
pnpm run dev
