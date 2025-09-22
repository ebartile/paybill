import DevelopersDropdown from '~/components/layouts/Nav/DevelopersDropdown'
import { data as DevelopersData } from '~/data/developers'

export const getMenu = () => ({
  primaryNav: [
    {
      title: 'Developers',
      hasDropdown: true,
      dropdown: <DevelopersDropdown />,
      dropdownContainerClassName: 'rounded-xl',
      subMenu: DevelopersData,
    },
    {
      title: 'Features',
      url: '/features',
    },
    {
      title: 'Pricing',
      url: '/pricing',
    },
    {
      title: 'Docs',
      url: 'https://docs.paybill.dev',
    },
    {
      title: 'Blog',
      url: '/blog',
    },
  ],
})
