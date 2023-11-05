import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center mt-[30px]">
      <SignUp afterSignUpUrl="/onboarding" redirectUrl="/onboarding" />
    </div>
  );
}
