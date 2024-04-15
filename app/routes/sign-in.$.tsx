import { SignIn } from '@clerk/remix';

export default function SignInPage() {
  return (
    <div className="flex h-full min-h-full flex-col justify-center">
      <div className="flex h-full flex-col items-center justify-center">
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
}
