import { CommandHeader, CommandInput, CommandList, CommandMenu } from '~/components/layouts/CommandMenu'
import { useThemeSwitcherCommands } from '~/components/layouts/CommandMenu/prepackaged/ThemeSwitcher'
import { useApiKeysCommands } from './ApiKeys'
import { useApiUrlCommand } from './ApiUrl'
import { useProjectSwitchCommand, useConfigureOrganizationCommand } from './OrgProjectSwitcher'
import { useSupportCommands } from './Support'

export default function StudioCommandMenu() {
  useApiKeysCommands()
  useApiUrlCommand()
  useProjectSwitchCommand()
  useConfigureOrganizationCommand()
  // useBranchCommands()
  // useLayoutNavCommands()
  useSupportCommands()
  useThemeSwitcherCommands()

  return (
    <CommandMenu>
      <CommandHeader>
        <CommandInput />
      </CommandHeader>
      <CommandList />
    </CommandMenu>
  )
}
