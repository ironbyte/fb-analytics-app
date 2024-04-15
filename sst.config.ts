// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'moncys-fb-analytics-app',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const clerkPublishableKey = new sst.Secret('ClerkPublishableKey');
    const clerkSecretKey = new sst.Secret('ClerkSecretKey');

    new sst.aws.Remix('MoncysFBAnalyticsApp', {
      link: [clerkPublishableKey, clerkSecretKey],
      environment: {
        CLERK_SIGN_IN_URL: '/sign-in',
        CLERK_SIGN_UP_URL: '/sign-up',
        CLERK_AFTER_SIGN_IN_URL: '/dashboard',
        CLERK_AFTER_SIGN_UP_URL: '/dashboard',
      },
    });
  },
});
