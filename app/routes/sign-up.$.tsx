import { SignUp } from '@clerk/remix';

export default function SignUpPage() {
  return (
    <div className="flex h-full min-h-full flex-col justify-center">
      <div className="flex h-full flex-col items-center justify-center">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
}
