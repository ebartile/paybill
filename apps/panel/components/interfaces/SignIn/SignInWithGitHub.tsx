import * as Sentry from '@sentry/nextjs'
import { Github } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useLastSignIn } from 'hooks/useLastSignIn'
import { LastSignInWrapper } from './LastSignInWrapper'
import { BASE_PATH, buildPathWithParams, paybillClient } from '~/common'
import { Button } from '~/components/ui'

const SignInWithGitHub = () => {
  const [loading, setLoading] = useState(false)
  const [_, setLastSignInUsed] = useLastSignIn()

  async function handleGithubSignIn() {
    setLoading(true)

    try {
      // redirects to /sign-in to check if the user has MFA setup (handled in SignInLayout.tsx)
      const redirectTo = buildPathWithParams(
        `${
          process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
            ? location.origin
            : process.env.NEXT_PUBLIC_SITE_URL
        }${BASE_PATH}/sign-in-mfa?method=github`
      )

      const { error } = await paybillClient.signInWithOAuth({
        provider: 'github',
        options: { redirectTo },
      })

      if (error) throw error
      else setLastSignInUsed('github')
    } catch (error: any) {
      toast.error(`Failed to sign in via GitHub: ${error.message}`)
      Sentry.captureMessage('[CRITICAL] Failed to sign in via GH: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <LastSignInWrapper type="github">
      <Button
        block
        onClick={handleGithubSignIn}
        // set the width to 20 so that it matches the loading spinner and don't push the text when loading
        icon={<Github width={20} height={18} />}
        size="large"
        type="default"
        loading={loading}
      >
        Continue with GitHub
      </Button>
    </LastSignInWrapper>
  )
}

export default SignInWithGitHub
