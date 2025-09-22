import { FunctionComponent } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart,
  Braces,
  Brain,
  ChartScatter,
  Clock,
  Cloud,
  CloudCog,
  Database,
  DatabaseBackup,
  DatabaseZap,
  Eye,
  FileCode2,
  Folders,
  GitBranch,
  Globe,
  Image,
  Lock,
  Mail,
  MessageCircle,
  Package,
  Puzzle,
  RectangleEllipsis,
  Server,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Smartphone,
  Terminal,
  UploadCloud,
  Users,
  UserX,
  Zap,
} from 'lucide-react'
import { FlutterIcon, JsIcon, PythonIcon, SwiftIcon } from '~/components/ui'

export type FEATURE =
  | FEATURE_SHORTNAMES.DATABASE
  | FEATURE_SHORTNAMES.AUTHENTICATION
  | FEATURE_SHORTNAMES.STORAGE
  | FEATURE_SHORTNAMES.FUNCTIONS

export enum FEATURE_NAMES {
  DATABASE = 'Database',
  AUTHENTICATION = 'Authentication',
  STORAGE = 'Storage',
  FUNCTIONS = 'Edge Functions'
}

export enum FEATURE_SHORTNAMES {
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  STORAGE = 'storage',
  FUNCTIONS = 'functions',
}

export type FEATURE_MODULE =
  | FEATURE_MODULES_SHORTNAMES.CRON
  | FEATURE_MODULES_SHORTNAMES.QUEUES
  | FEATURE_MODULES_SHORTNAMES.VECTOR

// Feature Modules
export enum FEATURE_MODULES_NAMES {
  CRON = 'Cron',
  QUEUES = 'Queues',
  VECTOR = 'Vector',
}

export enum FEATURE_MODULES_SHORTNAMES {
  CRON = 'cron',
  QUEUES = 'queues',
  VECTOR = 'vector',
}

// icon can be 16px, 18px or 24px
interface Icon {
  '16': string
  '18': string
  '24': string
}

export interface FeatureProps {
  name: FEATURE_NAMES | FEATURE_MODULES_NAMES
  icon: Icon
}

export type Features = {
  [feature in FEATURE]: FeatureProps
}

export type FeatureModules = {
  [feature in FEATURE_MODULE]: FeatureProps
}

export const featureIcons: Features = {
  [FEATURE_SHORTNAMES.DATABASE]: {
    name: FEATURE_NAMES.DATABASE,
    icon: {
      '16': 'M3.502 6h8.996v4H3.502V6ZM3 10.002h10v4H3v-4ZM3 2h10v4H3V2Z',
      '18': 'M3.00829 6.33225H15.1778V11.6648H3.00829V6.33225Z M2 13.0839C2 12.3016 2.63418 11.6674 3.41647 11.6674H14.7483C15.5306 11.6674 16.1648 12.3016 16.1648 13.0839V15.5835C16.1648 16.3658 15.5306 17 14.7483 17H3.41647C2.63418 17 2 16.3658 2 15.5835V13.0839Z M2 2.41647C2 1.63418 2.63418 1 3.41647 1H14.7483C15.5306 1 16.1648 1.63418 16.1648 2.41647V4.9161C16.1648 5.6984 15.5306 6.33257 14.7483 6.33257H3.41647C2.63418 6.33257 2 5.6984 2 4.9161V2.41647Z',
      '24': 'M5.18625 8.66531H19.5035V15.331H5.18625V8.66531Z M4 17.0007C4 16.0804 4.7461 15.3343 5.66645 15.3343H18.9984C19.9187 15.3343 20.6648 16.0804 20.6648 17.0007V20.3335C20.6648 21.2539 19.9187 22 18.9984 22H5.66646C4.7461 22 4 21.2539 4 20.3335V17.0007Z M4 3.66646C4 2.7461 4.7461 2 5.66645 2H18.9984C19.9187 2 20.6648 2.7461 20.6648 3.66645V6.99926C20.6648 7.91962 19.9187 8.66572 18.9984 8.66572H5.66646C4.7461 8.66572 4 7.91962 4 6.99926V3.66646Z',
    },
  },
  [FEATURE_SHORTNAMES.AUTHENTICATION]: {
    name: FEATURE_NAMES.AUTHENTICATION,
    icon: {
      '16': 'M3.49414 9.97461H8.49414M3.49414 9.97461V11.9746H8.49414V9.97461M3.49414 9.97461V7.97461H8.49414V9.97461M10 5V3C10 1.89543 9.10457 1 8 1C6.89543 1 6 1.89543 6 3V5M3.47266 7L3.47266 12C3.47266 13.1046 4.36809 14 5.47266 14H10.4727C11.5772 14 12.4727 13.1046 12.4727 12V7C12.4727 5.89543 11.5772 5 10.4727 5L5.47266 5C4.36809 5 3.47266 5.89543 3.47266 7Z',
      '18': 'M3.02644 12.0457H9.18048M3.02644 12.0457V14.5072H9.18048V12.0457M3.02644 12.0457V9.58414H9.18048V12.0457M11.0339 5.92308V3.46154C11.0339 2.10207 9.93179 1 8.57228 1C7.21277 1 6.11067 2.10207 6.11067 3.46154V5.92308M3 8.38465L3 14.5384C3 15.8979 4.10208 17 5.46157 17H11.6157C12.9752 17 14.0773 15.8979 14.0773 14.5384V8.38465C14.0773 7.02516 12.9752 5.92308 11.6157 5.92308L5.46158 5.92308C4.10209 5.92308 3 7.02516 3 8.38465Z',
      '24': 'M5.03305 15.8071H12.7252M5.03305 15.8071V18.884H12.7252V15.8071M5.03305 15.8071V12.7302H12.7252V15.8071M15.0419 8.15385V5.07692C15.0419 3.37759 13.6643 2 11.965 2C10.2657 2 8.88814 3.37759 8.88814 5.07692V8.15385M5 11.2307L5 18.9231C5 20.6224 6.37757 22 8.07689 22H15.769C17.4683 22 18.8459 20.6224 18.8459 18.9231V11.2307C18.8459 9.53142 17.4683 8.15385 15.769 8.15385L8.07689 8.15385C6.37757 8.15385 5 9.53142 5 11.2307Z',
    },
  },
  [FEATURE_SHORTNAMES.STORAGE]: {
    name: FEATURE_NAMES.STORAGE,
    icon: {
      '16': 'M12.9997 7.50869V5.60119L9.38151 2.00024H3.99967C3.44739 2.00024 2.99967 2.44796 2.99967 3.00024V5.99976M12.9645 5.58447L9.38004 2L9.38004 4.58447C9.38004 5.13676 9.82776 5.58447 10.38 5.58447L12.9645 5.58447ZM4.44135 5.99976H2.97363C2.42135 5.99976 1.97363 6.44747 1.97363 6.99976V11.9998C1.97363 13.1043 2.86906 13.9998 3.97363 13.9998H11.9736C13.0782 13.9998 13.9736 13.1043 13.9736 11.9998V8.50869C13.9736 7.95641 13.5259 7.50869 12.9736 7.50869H6.79396C6.53157 7.50869 6.27968 7.40556 6.09263 7.22153L5.14268 6.28692C4.95563 6.10289 4.70375 5.99976 4.44135 5.99976Z',
      '18': 'M15.7014 8.34507V5.80169L10.8772 1.00033H3.7014C2.96501 1.00033 2.36805 1.59728 2.36805 2.33367V6.33312M15.6545 5.77939L10.8752 1L10.8752 4.44605C10.8752 5.18243 11.4722 5.77939 12.2086 5.77939L15.6545 5.77939ZM4.29028 6.33312H2.33335C1.59696 6.33312 1 6.93008 1 7.66647V14.3333C1 15.8061 2.19392 17 3.66669 17H14.3333C15.8061 17 17 15.8061 17 14.3333V9.67842C17 8.94203 16.403 8.34507 15.6667 8.34507H7.42712C7.07725 8.34507 6.7414 8.20755 6.492 7.96218L5.2254 6.71601C4.976 6.47063 4.64015 6.33312 4.29028 6.33312Z',
      '24': 'M20.4997 12.1386V9.15811L14.8463 3.53163H6.43717C5.57423 3.53163 4.87467 4.23119 4.87467 5.09413V9.78087M20.4447 9.13199L14.844 3.53125L14.844 7.56949C14.844 8.43243 15.5436 9.13199 16.4065 9.13199L20.4447 9.13199ZM7.12729 9.78087H4.83398C3.97104 9.78087 3.27148 10.4804 3.27148 11.3434V19.1559C3.27148 20.8818 4.67059 22.2809 6.39648 22.2809H18.8965C20.6224 22.2809 22.0215 20.8818 22.0215 19.1559V13.7011C22.0215 12.8381 21.3219 12.1386 20.459 12.1386H10.8032C10.3933 12.1386 9.99969 11.9774 9.70743 11.6899L8.22312 10.2296C7.93086 9.94202 7.53729 9.78087 7.12729 9.78087Z',
    },
  },
  [FEATURE_SHORTNAMES.FUNCTIONS]: {
    name: FEATURE_NAMES.FUNCTIONS,
    icon: {
      '16': 'M1.857 11.36a7 7 0 0 1 9.41-9.551M4.774 14.212a7 7 0 0 0 9.41-9.497m-8.812 7.845a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm9.296-9.13a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM12.5 8a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
      '18': 'M5.31216 16.101C6.41582 16.6754 7.67021 17 9.00043 17C13.419 17 17.0009 13.4183 17.0009 9C17.0009 7.66622 16.6744 6.40868 16.0971 5.30289M12.7352 1.92336C11.6203 1.33382 10.3494 1 9.00043 1C4.58192 1 1 4.58172 1 9C1 10.3615 1.34015 11.6436 1.94012 12.766M1.94012 12.766C1.61762 13.16 1.42413 13.6637 1.42413 14.2126C1.42413 15.475 2.44753 16.4983 3.70997 16.4983C4.9724 16.4983 5.99581 15.475 5.99581 14.2126C5.99581 12.9502 4.9724 11.9269 3.70997 11.9269C2.99646 11.9269 2.35931 12.2538 1.94012 12.766ZM16.6199 3.7793C16.6199 5.04166 15.5965 6.06501 14.3341 6.06501C13.0716 6.06501 12.0482 5.04166 12.0482 3.7793C12.0482 2.51693 13.0716 1.49358 14.3341 1.49358C15.5965 1.49358 16.6199 2.51693 16.6199 3.7793ZM14.1436 9C14.1436 11.8403 11.8409 14.1429 9.00043 14.1429C6.15996 14.1429 3.8573 11.8403 3.8573 9C3.8573 6.15968 6.15996 3.85714 9.00043 3.85714C11.8409 3.85714 14.1436 6.15968 14.1436 9Z',
      '24': 'M6.6594 21.8201C8.10788 22.5739 9.75418 23 11.5 23C17.299 23 22 18.299 22 12.5C22 10.7494 21.5716 9.09889 20.8139 7.64754M16.4016 3.21191C14.9384 2.43814 13.2704 2 11.5 2C5.70101 2 1 6.70101 1 12.5C1 14.287 1.44643 15.9698 2.23384 17.4428M2.23384 17.4428C1.81058 17.96 1.55664 18.6211 1.55664 19.3416C1.55664 20.9984 2.89979 22.3416 4.55664 22.3416C6.21349 22.3416 7.55664 20.9984 7.55664 19.3416C7.55664 17.6847 6.21349 16.3416 4.55664 16.3416C3.62021 16.3416 2.78399 16.7706 2.23384 17.4428ZM21.5 5.64783C21.5 7.30468 20.1569 8.64783 18.5 8.64783C16.8432 8.64783 15.5 7.30468 15.5 5.64783C15.5 3.99097 16.8432 2.64783 18.5 2.64783C20.1569 2.64783 21.5 3.99097 21.5 5.64783ZM18.25 12.5C18.25 16.2279 15.2279 19.25 11.5 19.25C7.77208 19.25 4.75 16.2279 4.75 12.5C4.75 8.77208 7.77208 5.75 11.5 5.75C15.2279 5.75 18.25 8.77208 18.25 12.5Z',
    },
  }
}

export const FEATURE_MODULES: FeatureModules = {
  [FEATURE_MODULES_SHORTNAMES.CRON]: {
    name: FEATURE_MODULES_NAMES.CRON,
    icon: {
      '16': 'M8.02637 4.34082V8.09082H10.8389M14.2764 8.09082C14.2764 11.5426 11.4781 14.3408 8.02637 14.3408C4.57459 14.3408 1.77637 11.5426 1.77637 8.09082C1.77637 4.63904 4.57459 1.84082 8.02637 1.84082C11.4781 1.84082 14.2764 4.63904 14.2764 8.09082Z',
      '18': 'M8.02637 4.34082V8.09082H10.8389M14.2764 8.09082C14.2764 11.5426 11.4781 14.3408 8.02637 14.3408C4.57459 14.3408 1.77637 11.5426 1.77637 8.09082C1.77637 4.63904 4.57459 1.84082 8.02637 1.84082C11.4781 1.84082 14.2764 4.63904 14.2764 8.09082Z',
      '24': 'M12 6.375V12H16.2188M21.375 12C21.375 17.1777 17.1777 21.375 12 21.375C6.82233 21.375 2.625 17.1777 2.625 12C2.625 6.82233 6.82233 2.625 12 2.625C17.1777 2.625 21.375 6.82233 21.375 12Z',
    },
  },
  [FEATURE_MODULES_SHORTNAMES.QUEUES]: {
    name: FEATURE_MODULES_NAMES.QUEUES,
    icon: {
      '16': 'M9.27637 1.84082H12.7764C13.6048 1.84082 14.2764 2.51239 14.2764 3.34082V6.84082C14.2764 7.66925 13.6048 8.34082 12.7764 8.34082H9.27637C8.44794 8.34082 7.77637 7.66925 7.77637 6.84082V3.34082C7.77637 2.51239 8.44794 1.84082 9.27637 1.84082Z',
      '18': 'M9.27637 1.84082H12.7764C13.6048 1.84082 14.2764 2.51239 14.2764 3.34082V6.84082C14.2764 7.66925 13.6048 8.34082 12.7764 8.34082H9.27637C8.44794 8.34082 7.77637 7.66925 7.77637 6.84082V3.34082C7.77637 2.51239 8.44794 1.84082 9.27637 1.84082Z',
      '24': 'M17.625 16.2902C17.625 17.0274 17.0274 17.625 16.2902 17.625H9.375C7.71815 17.625 6.375 16.2819 6.375 14.625V8.14725C6.375 7.16846 7.16846 6.375 8.14725 6.375M13.125 20.7902C13.125 21.5274 12.5274 22.125 11.7902 22.125H4.875C3.21815 22.125 1.875 20.7819 1.875 19.125V12.6472C1.875 11.6685 2.66846 10.875 3.64725 10.875M13.875 13.125H19.125C20.7819 13.125 22.125 11.7819 22.125 10.125V4.875C22.125 3.21815 20.7819 1.875 19.125 1.875H13.875C12.2181 1.875 10.875 3.21815 10.875 4.875V10.125C10.875 11.7819 12.2181 13.125 13.875 13.125Z',
    },
  },
  [FEATURE_MODULES_SHORTNAMES.VECTOR]: {
    name: FEATURE_MODULES_NAMES.VECTOR,
    icon: {
      '16': 'M7.99886 7.63216V14.4892M7.99886 7.63216L14.0488 4.11804M7.99886 7.63216L1.94922 4.11819M1.94922 4.11819V8.32332M1.94922 4.11819V4.08217L5.57319 1.97717M14.049 8.36007V4.08217L10.4251 1.97717M11.8165 12.4072L7.99913 14.6245L4.18177 12.4072',
      '18': 'M8.61033 8.15404V16.8287M8.61033 8.15404L16.264 3.70838M8.61033 8.15404L0.957031 3.70858M0.957031 3.70858V9.02842M0.957031 3.70858V3.66301L5.54166 1M16.2643 9.07491V3.66301L11.6797 1M13.44 14.1949L8.61068 17L3.7814 14.1949',
      '24': 'M11.9983 11.4482V21.7337M11.9983 11.4482L21.0732 6.17699M11.9983 11.4482L2.92383 6.17723M2.92383 6.17723V12.4849M2.92383 6.17723V6.1232L8.35978 2.9657M21.0736 12.54V6.1232L15.6376 2.9657M17.7247 18.6107L11.9987 21.9367L6.27265 18.6107',
    },
  },
}

enum ADDITIONAL_FEATURES {
  PLATFORM = 'platform',
  CLOUD = 'cloud',
}

export type FeatureFeatureType = FEATURE | FEATURE_MODULE | ADDITIONAL_FEATURES

export enum FEATURE_STAGES {
  PRIVATE_ALPHA = 'Private Alpha',
  PUBLIC_ALPHA = 'Public Alpha',
  BETA = 'Beta',
  PUBLIC_BETA = 'Public Beta',
  GA = 'General Availability',
}

export type FeatureType = {
  /**
   * name of the feature
   */
  title: string
  /**
   * subtitle will be displayed in the feature card, after the title
   */
  subtitle: string
  /**
   * slug of the feature page
   */
  slug: string
  /**
   * icon will be displayed in the feature card
   */
  icon: string | LucideIcon | FunctionComponent
  /**
   * Each feature belongs to one or more features
   */
  features: FeatureFeatureType[]
  docsUrl?: string
  /**
   * feature metadata on its status
   */
  status?: {
    stage: FEATURE_STAGES
    availableOnSelfHosted: boolean
    selfHostedTooling?: {
      label: string
      link: string
    }
  }
}

export type MainFeatureType = {
  [key: string]: {
    name: string
    icon: string
    description: string | JSX.Element
    description_short: string
    label: string
    url: string
  }
}

export const MainFeatures: MainFeatureType = {
  [FEATURE_SHORTNAMES.DATABASE]: {
    name: FEATURE_NAMES.DATABASE,
    icon: featureIcons.database.icon[24],
    description: (
      <>
        Every project is <strong>a full Postgres database</strong>, the world's most trusted
        relational database.
      </>
    ),
    description_short: 'Fully portable Postgres database',
    label: '',
    url: 'https://docs.paybill.dev/features/database',
  },
  [FEATURE_SHORTNAMES.AUTHENTICATION]: {
    name: FEATURE_NAMES.AUTHENTICATION,
    icon: featureIcons.authentication.icon[24],
    description: (
      <>
        <strong>Add user sign ups and logins</strong>, securing your data with Row Level Security.
      </>
    ),
    description_short: 'User Management out of the box',
    label: '',
    url: 'https://docs.paybill.dev/features/auth',
  },
  [FEATURE_SHORTNAMES.STORAGE]: {
    name: FEATURE_NAMES.STORAGE,
    icon: featureIcons.storage.icon[24],
    description: (
      <>
        <strong>Store, organize, and serve</strong> large files, from videos to images.
      </>
    ),
    description_short: 'Serverless storage for any media',
    label: '',
    url: 'https://docs.paybill.dev/features/storage',
  },
  [FEATURE_SHORTNAMES.FUNCTIONS]: {
    name: FEATURE_NAMES.FUNCTIONS,
    icon: featureIcons.functions.icon[24],
    description: (
      <>
        Easily write custom code <strong>without deploying or scaling servers.</strong>
      </>
    ),
    description_short: 'Deploy code globally on the edge',
    label: '',
    url: 'https://docs.paybill.dev/features/edge-functions',
  }
}

export const features: FeatureType[] = [
  // Database
  {
    title: 'Any database',
    subtitle: 'Every project is a full database.',
    icon: Database,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/database/overview',
    slug: 'database',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Vector database',
    subtitle: 'Store vector embeddings right next to the rest of your data.',
    icon: ChartScatter,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/ai',
    slug: 'vector-database',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Auto-generated REST API',
    subtitle: 'RESTful APIs auto-generated from your database.',
    icon: FileCode2,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/api#rest-api-overview',
    slug: 'auto-generated-rest-api',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Database backups',
    subtitle: 'Projects are backed up daily with Point in Time recovery options.',
    icon: DatabaseBackup,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/platform/backups',
    slug: 'database-backups',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
      selfHostedTooling: {
        label: 'wal-g',
        link: 'https://github.com/wal-g/wal-g',
      },
    },
  },
  {
    title: 'Custom domains',
    subtitle: 'White-label the Paybill APIs for a branded experience.',
    icon: Globe,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/platform/custom-domains',
    slug: 'custom-domains',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: false,
    },
  },
  {
    title: 'Network restrictions',
    subtitle: 'Restrict IP ranges that can connect to your project.',
    icon: UserX,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/platform/network-restrictions',
    slug: 'network-restrictions',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: false,
    },
  },
  {
    title: 'SSL enforcement',
    subtitle: 'Enforce secure connections to your clients.',
    icon: ShieldCheck,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/platform/ssl-enforcement',
    slug: 'ssl-enforcement',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: false,
    },
  },
  {
    title: 'Branching',
    subtitle: 'Test and preview changes using Paybill Branches.',
    icon: GitBranch,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/platform/branching',
    slug: 'branching',
    status: {
      stage: FEATURE_STAGES.BETA,
      availableOnSelfHosted: false,
    },
  },
  {
    title: 'Read replicas',
    subtitle: 'Deploy read-only databases across multiple regions for lower latency.',
    icon: Database,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/platform/read-replicas',
    slug: 'read-replicas',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: false,
    },
  },
  {
    title: 'Extensions',
    subtitle: 'Enhance your database with popular extensions.',
    icon: Puzzle,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/extensions',
    slug: 'extensions',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Webhooks',
    subtitle: 'Trigger external payloads on events.',
    icon: Cloud,
    features: [FEATURE_SHORTNAMES.FUNCTIONS],
    docsUrl: 'https://docs.paybill.dev/docs/guides/webhooks',
    slug: 'webhooks',
    status: {
      stage: FEATURE_STAGES.BETA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Vault',
    subtitle: 'Manage secrets safely in Database.',
    icon: Lock,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/database/vault',
    slug: 'vault',
    status: {
      stage: FEATURE_STAGES.PUBLIC_ALPHA,
      availableOnSelfHosted: true,
    },
  },
  // Auth
  {
    title: 'Email login',
    subtitle: 'Build email logins for your application or website.',
    icon: Mail,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/passwords',
    slug: 'email-login',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Social login',
    subtitle: 'Provide social logins from platforms like Apple, GitHub, and Slack.',
    icon: Users,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/social-login',
    slug: 'social-login',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Phone logins',
    subtitle: 'Provide phone logins using a third-party SMS provider.',
    icon: Smartphone,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/phone-login',
    slug: 'phone-logins',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Passwordless login via Magic Links',
    subtitle: 'Build passwordless logins via magic links for your application or website.',
    icon: Lock,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/auth-email-passwordless',
    slug: 'passwordless-login-via-magicklink',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Multi-Factor Authentication (MFA)',
    subtitle: 'Add an extra layer of security to your application with MFA.',
    icon: Lock,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/auth-mfa',
    slug: 'multi-factor-authentication',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Authorization via Row Level Security',
    subtitle: 'Control the data each user can access with Postgres Policies.',
    icon: Lock,
    features: [FEATURE_SHORTNAMES.DATABASE, FEATURE_SHORTNAMES.AUTHENTICATION],
        docsUrl: 'https://docs.paybill.dev/docs/guides/auth/row-level-security',
    slug: 'row-level-security',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Captcha protection',
    subtitle: 'Add Captcha to your sign-in, sign-up, and password reset forms.',
    icon: RectangleEllipsis,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/auth-captcha',
    slug: 'auth-captcha-protection',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Server-side Auth',
    subtitle: 'Helpers for implementing user authentication in popular server-side languages.',
    icon: Server,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION],
    docsUrl: 'https://docs.paybill.dev/docs/guides/auth/server-side',
    slug: 'server-side-auth',
    status: {
      stage: FEATURE_STAGES.BETA,
      availableOnSelfHosted: true,
    },
  },
  // Storage
  {
    title: 'File storage',
    subtitle: 'Storage makes it simple to store and serve files.',
    icon: Folders,
    features: [FEATURE_SHORTNAMES.STORAGE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/storage',
    slug: 'file-storage',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Content Delivery Network',
    subtitle: 'Cache large files using the CDN.',
    icon: Cloud,
    features: [FEATURE_SHORTNAMES.STORAGE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/storage/cdn',
    slug: 'cdn',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
      selfHostedTooling: {
        label: 'Cloudflare',
        link: 'https://www.cloudflare.com',
      },
    },
  },
  {
    title: 'Smart Content Delivery Network',
    subtitle: 'Automatically revalidate assets at the edge via the Smart CDN.',
    icon: Cloud,
    features: [FEATURE_SHORTNAMES.STORAGE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/storage/cdn/smart-cdn',
    slug: 'smart-cdn',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
      selfHostedTooling: {
        label: 'Cloudflare',
        link: 'https://www.cloudflare.com',
      },
    },
  },
  {
    title: 'Image transformations',
    subtitle: 'Optimize and resize images on-the-fly directly from your storage buckets.',
    icon: Image,
    features: [FEATURE_SHORTNAMES.STORAGE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/storage/image-transformations',
    slug: 'image-transformations',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Resumable uploads',
    subtitle: 'Upload large files using resumable uploads.',
    icon: UploadCloud,
    features: [FEATURE_SHORTNAMES.STORAGE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/storage/uploads/resumable-uploads',
    slug: 'resumable-uploads',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'S3 compatibility',
    subtitle: 'Interact with Storage from tools which support the S3 protocol.',
    icon: UploadCloud,
    features: [FEATURE_SHORTNAMES.STORAGE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/storage/s3/compatibility',
    slug: 's3-compatibility',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  // Functions
  {
    title: 'Edge Functions',
    subtitle: 'Globally distributed TypeScript functions to execute custom business logic.',
    icon: FileCode2,
    features: [FEATURE_SHORTNAMES.FUNCTIONS],
    docsUrl: 'https://docs.paybill.dev/docs/guides/functions',
    slug: 'edge-functions',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'NPM compatibility',
    subtitle: 'Edge Functions natively support NPM modules and Node built-in APIs.',
    icon: FileCode2,
    features: [FEATURE_SHORTNAMES.FUNCTIONS],
    docsUrl: 'https://docs.paybill.dev/docs/guides/functions/npm-compatibility',
    slug: 'npm-compatibility',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  // Vector
  {
    title: 'AI Integrations',
    subtitle: 'Enhance applications with OpenAI and Hugging Face integrations.',
    icon: Brain,
    features: [FEATURE_MODULES_SHORTNAMES.VECTOR],
    docsUrl: 'https://docs.paybill.dev/docs/guides/ai-integrations',
    slug: 'ai-integrations',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  // Platform
  {
    title: 'CLI',
    subtitle: 'Use our CLI to develop your project locally and deploy.',
    icon: Terminal,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl:
      'https://docs.paybill.dev/docs/guides/cli',
    slug: 'cli',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Management API',
    subtitle: 'Manage your projects programmatically.',
    icon: FileCode2,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/reference/api/introduction',
    slug: 'management-api',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Role-Based Access Control (RBAC)',
    icon: ShieldPlus,
    subtitle: 'Define and manage user roles securely',
        features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl:
      'https://docs.paybill.dev/docs/guides/database/custom-claims-and-role-based-access-control-rbac',
    slug: 'role-based-access-control',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: false,
    },
  },
  // Analytics
  {
    title: 'Reports & Metrics',
    subtitle: "Monitor your project's health with usage insights.",
    icon: BarChart,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/reports-and-metrics',
    slug: 'reports-and-metrics',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  // CLOUD
  {
    title: 'AI Assistant',
    subtitle: 'Your intelligent companion for managing databases.',
    icon: Brain,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/ai/assistant',
    slug: 'ai-assistant',
    status: {
      stage: FEATURE_STAGES.PUBLIC_ALPHA,
      availableOnSelfHosted: true,
      selfHostedTooling: {
        label: 'OpenAI API Key',
        link: 'https://platform.openai.com/docs/libraries#create-and-export-an-api-key',
      },
    },
  },
  {
    title: 'Logs & Analytics',
    subtitle: 'Gain insights into your application’s performance and usage.',
    icon: Activity,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/monitoring-troubleshooting/logs',
    slug: 'logs-analytics',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Visual Schema Designer',
    subtitle: 'Design your Postgres database schema with an intuitive interface.',
    icon: RectangleEllipsis,
    features: [ADDITIONAL_FEATURES.CLOUD],
    docsUrl: 'https://docs.paybill.dev/docs/guides/schema-visualizer',
    slug: 'visual-schema-designer',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Policy Management',
    subtitle: 'Quickly implement common security policies.',
    icon: ShieldPlus,
    features: [ADDITIONAL_FEATURES.CLOUD],
    docsUrl: 'https://docs.paybill.dev/docs/guides/policy-templates',
    slug: 'policy-templates',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'SQL Editor',
    subtitle: 'A powerful interface for writing and executing SQL queries.',
    icon: FileCode2,
    features: [ADDITIONAL_FEATURES.CLOUD],
    docsUrl: 'https://docs.paybill.dev/docs/guides/sql-editor',
    slug: 'sql-editor',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Role Management',
    subtitle: 'Managing access to your database and configuring permissions.',
    icon: Users,
    features: [FEATURE_SHORTNAMES.DATABASE, ADDITIONAL_FEATURES.CLOUD],
    docsUrl: 'https://docs.paybill.dev/docs/guides/database/roles',
    slug: 'postgres-roles',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'User Impersonation',
    subtitle: 'Experience your application as any user.',
    icon: Users,
    features: [FEATURE_SHORTNAMES.AUTHENTICATION, ADDITIONAL_FEATURES.CLOUD],
    docsUrl: 'https://docs.paybill.dev/docs/guides/user-impersonation',
    slug: 'user-impersonation',
    status: {
      stage: FEATURE_STAGES.PUBLIC_BETA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Foreign Key Selector',
    subtitle: 'Easily manage foreign key relationships between tables.',
    icon: DatabaseZap,
    features: [ADDITIONAL_FEATURES.CLOUD],
        docsUrl: 'https://docs.paybill.dev/docs/guides/foreign-key-selector',
    slug: 'foreign-key-selector',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Log Drains',
    subtitle: 'Export logs to external destinations for enhanced monitoring.',
    icon: Activity,
    features: [ADDITIONAL_FEATURES.CLOUD],
    docsUrl: 'https://docs.paybill.dev/docs/guides/log-drains',
    slug: 'log-drains',
    status: {
      stage: FEATURE_STAGES.PUBLIC_ALPHA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Client Library - JavaScript',
    subtitle: 'Easily integrate Paybill with your JavaScript applications.',
    icon: JsIcon,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/reference/javascript/start',
    slug: 'client-library-javascript',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Client Library - Flutter',
    subtitle: 'Integrate Paybill into your Flutter applications effortlessly.',
    icon: FlutterIcon,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/reference/dart/start',
    slug: 'client-library-flutter',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Client Library - Swift',
    subtitle: 'Effortlessly connect your Swift applications to Paybill.',
    icon: SwiftIcon,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/reference/swift/start',
    slug: 'client-library-swift',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Client Library - Python',
    subtitle: 'Integrate Paybill easily into your Python applications.',
    icon: PythonIcon,
    features: [ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/reference/python/start',
    slug: 'client-library-python',
    status: {
      stage: FEATURE_STAGES.BETA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Cron',
    subtitle: 'Schedule recurring Jobs.',
    icon: Clock,
    features: [FEATURE_SHORTNAMES.DATABASE, ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/cron',
    slug: 'cron',
    status: {
      stage: FEATURE_STAGES.BETA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'MCP Server',
    subtitle:
      'Connect your AI tools using the official Paybill Model Context Protocol (MCP) server.',
    icon: CloudCog,
    features: [FEATURE_SHORTNAMES.DATABASE, ADDITIONAL_FEATURES.PLATFORM],
    docsUrl: 'https://docs.paybill.dev/docs/guides/getting-started/mcp',
    slug: 'mcp-server',
    status: {
      stage: FEATURE_STAGES.PUBLIC_ALPHA,
      availableOnSelfHosted: true,
    },
  },
  {
    title: 'Declarative Schemas',
    subtitle: 'Simplify database management with declarative schema files.',
    icon: Database,
    features: [FEATURE_SHORTNAMES.DATABASE],
    docsUrl: 'https://docs.paybill.dev/docs/guides/local-development/declarative-database-schemas',
    slug: 'declarative-schemas',
    status: {
      stage: FEATURE_STAGES.GA,
      availableOnSelfHosted: true,
    },
  },
]