import * as Sentry from '@sentry/nextjs'
import { useState } from 'react'
import { toast } from 'sonner'

import { useLastSignIn } from 'hooks/useLastSignIn'
import { LastSignInWrapper } from './LastSignInWrapper'
import { BASE_PATH, buildPathWithParams, paybillClient } from '~/common'
import { Button } from '~/components/ui'

const SignInWithGoogle = () => {
  const [loading, setLoading] = useState(false)
  const [_, setLastSignInUsed] = useLastSignIn()

  async function handleGoogleSignIn() {
    setLoading(true)

    try {
      // redirects to /sign-in to check if the user has MFA setup (handled in SignInLayout.tsx)
      const redirectTo = buildPathWithParams(
        `${
          process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
            ? location.origin
            : process.env.NEXT_PUBLIC_SITE_URL
        }${BASE_PATH}/sign-in-mfa?method=google`
      )

      const { error } = await paybillClient.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })

      if (error) throw error
      else setLastSignInUsed('google')
    } catch (error: any) {
      toast.error(`Failed to sign in via Google: ${error.message}`)
      Sentry.captureMessage('[CRITICAL] Failed to sign in via Google: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <LastSignInWrapper type="google">
      <Button
        block
        onClick={handleGoogleSignIn}
        // set the width to 20 so that it matches the loading spinner and don't push the text when loading
        // icon={<Google width={20} height={18} />}
        size="large"
        type="default"
        loading={loading}
      >
        Continue with Google
      </Button>
    </LastSignInWrapper>
  )
}

export default SignInWithGoogle
