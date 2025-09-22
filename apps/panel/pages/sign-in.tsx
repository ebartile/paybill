import SignInForm from 'components/interfaces/SignIn/SignInForm'
import SignInWithGitHub from 'components/interfaces/SignIn/SignInWithGitHub'
import SignInWithGoogle from 'components/interfaces/SignIn/SignInWithGoogle'
import { AuthenticationLayout } from 'components/layouts/AuthenticationLayout'
import SignInLayout from 'components/layouts/SignInLayout/SignInLayout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { NextPageWithLayout } from 'types'

const SignInPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col gap-5">
        <SignInWithGitHub />
        <SignInWithGoogle />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-strong" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-sm bg-studio text-foreground">or</span>
          </div>
        </div>

        <SignInForm />
      </div>

      <div className="self-center my-8 text-sm">
        <div>
          <span className="text-foreground-light">Don't have an account?</span>{' '}
          <Link
            href={{
              pathname: '/sign-up',
              query: router.query,
            }}
            className="underline transition text-foreground hover:text-foreground-light"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </>
  )
}

SignInPage.getLayout = (page) => (
  <AuthenticationLayout>
    <SignInLayout
      heading="Welcome back"
      subheading="Sign in to your account"
      logoLinkToMarketingSite={true}
    >
      {page}
    </SignInLayout>
  </AuthenticationLayout>
)

export default SignInPage
