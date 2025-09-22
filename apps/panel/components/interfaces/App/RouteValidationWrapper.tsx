import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { toast } from 'sonner'

import { LOCAL_STORAGE_KEYS, useIsLoggedIn, useIsMFAEnabled } from 'common'
import { useOrganizationsQuery } from 'data/organizations/organizations-query'
import { useProjectsQuery } from 'data/projects/projects-query'
import useLatest from '~/hooks/useLatest'
import { useLocalStorageQuery } from '~/hooks/useLocalStorage'
import { useSelectedOrganization } from '~/hooks/useSelectedOrganization'
import { useParams } from '~/hooks/useParams'

// Ideally these could all be within a _middleware when we use Next 12
const RouteValidationWrapper = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter()
  const { ref, slug, id } = useParams()

  const isLoggedIn = useIsLoggedIn()
  const isUserMFAEnabled = useIsMFAEnabled()

  const organization = useSelectedOrganization()

  const [__, setLastVisitedOrganization] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.LAST_VISITED_ORGANIZATION,
    ''
  )

  const DEFAULT_HOME = '/organizations'

  /**
   * Array of urls/routes that should be ignored
   */
  const excemptUrls: string[] = [
    // project creation route, allows the page to self determine it's own route, it will redirect to the first org
    // or prompt the user to create an organaization
    // this is used by database.dev, usually as /new/new-project
    '/new/[slug]',
    '/join',
  ]

  /**
   * Map through all the urls that are excluded
   * from route validation check
   *
   * @returns a boolean
   */
  function isExceptUrl() {
    return excemptUrls.includes(router?.pathname)
  }

  const { data: organizations, isSuccess: orgsInitialized } = useOrganizationsQuery({
    enabled: isLoggedIn,
  })
  const organizationsRef = useLatest(organizations)

  useEffect(() => {
    // check if current route is excempted from route validation check
    if (isExceptUrl() || !isLoggedIn) return

    if (orgsInitialized && slug) {
      // Check validity of organization that user is trying to access
      const organizations = organizationsRef.current ?? []
      const isValidOrg = organizations.some((org) => org.slug === slug)

      if (!isValidOrg) {
        toast.error("We couldn't find that organization")
        router.push(`${DEFAULT_HOME}?error=org_not_found&org=${slug}`)
        return
      }
    }
  }, [orgsInitialized])

  const { data: projects, isSuccess: projectsInitialized } = useProjectsQuery({
    enabled: isLoggedIn,
  })
  const projectsRef = useLatest(projects)

  useEffect(() => {
    // check if current route is excempted from route validation check
    if (isExceptUrl() || !isLoggedIn) return

    if (projectsInitialized && ref) {
      // Check validity of project that the user is trying to access
      const projects = projectsRef.current ?? []
      const isValidProject = projects.some((project) => project.ref === ref)
      const isValidBranch = projects.some((project) => project.preview_branch_refs.includes(ref))

      if (!isValidProject && !isValidBranch) {
        toast.error('This project does not exist')
        router.push(DEFAULT_HOME)
        return
      }
    }
  }, [projectsInitialized])

  useEffect(() => {
    if (organization) {
      setLastVisitedOrganization(organization.slug)

      if (
        organization.organization_requires_mfa &&
        !isUserMFAEnabled &&
        router.pathname !== '/org/[slug]'
      ) {
        router.push(`/org/${organization.slug}`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization])

  return <>{children}</>
}

export default RouteValidationWrapper
