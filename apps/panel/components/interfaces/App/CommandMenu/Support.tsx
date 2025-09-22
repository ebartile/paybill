import { LifeBuoy } from 'lucide-react'
import { useMemo } from 'react'

import type { ICommand } from '~/components/layouts/CommandMenu'
import { useRegisterCommands } from '~/components/layouts/CommandMenu'
import { COMMAND_MENU_SECTIONS } from './CommandMenu.utils'

const useSupportCommands = () => {
  const commands = useMemo(
    () =>
      [
        {
          id: 'support',
          name: 'Support',
          route: 'https://www.paybill.dev/support',
          icon: () => <LifeBuoy />,
        },
        {
          id: 'system-status',
          name: 'System Status',
          value: 'Support: System Status',
          route: '#',
          icon: () => <LifeBuoy />,
        },
        {
          id: 'github-discussions',
          name: 'GitHub Discussions',
          value: 'Support: GitHub Discussions',
          route: 'https://github.com/orgs/paybilldev/discussions',
          icon: () => <LifeBuoy />,
          defaultHidden: true,
        },
      ] as Array<ICommand>,
    []
  )

  useRegisterCommands(COMMAND_MENU_SECTIONS.SUPPORT, commands, { enabled: true })
}

export { useSupportCommands }
