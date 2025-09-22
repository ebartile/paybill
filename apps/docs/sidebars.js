/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      'type': 'category',
      'label': 'Getting Started',
      'className': 'category-as-header getting-started-header',
      'collapsed': false,
      'collapsible': false,
      'items': [
        'index',
        {
          'type': 'category',
          'label': 'Deployment',
          'link': {
            'type': 'doc',
            'id': 'setup/index',
          },
          'items': [
            'setup/try-paybill',
            'setup/choose-your-paybill',
            'setup/system-requirements',
            'setup/digitalocean',
            'setup/docker',
            'setup/ami',
            'setup/ecs',
            'setup/openshift',
            'setup/helm',
            'setup/kubernetes',
            'setup/kubernetes-gke',
            'setup/kubernetes-aks',
            'setup/kubernetes-eks',
            'setup/azure-container',
            'setup/google-cloud-run',
            'setup/env-vars',
            'setup/firebase',
            'setup/netlify',
            'setup/upgrade-to-lts'
          ]
        }
      ],
    },
    {
      'type': 'category',
      'collapsed': false,
      'collapsible': false,
      'className': 'category-as-header dev-cycle-header',
      'label': 'Development Lifecycle',
      'items': [
        'development-lifecycle/overview',
        {
          'type': 'category',
          'label': 'Release Management',
          'items': [
            'development-lifecycle/release/version-control',
            'development-lifecycle/release/release-rollback'
          ]
        },
        {
          'type': 'category',
          'label': 'GitSync',
          'items': [
            'development-lifecycle/gitsync/overview',
            'development-lifecycle/gitsync/multi-environment',
            'development-lifecycle/gitsync/github-config',
            'development-lifecycle/gitsync/gitlab-config',
            'development-lifecycle/gitsync/gitea-config',
            'development-lifecycle/gitsync/delete-gitsync',
            'development-lifecycle/gitsync/push',
            'development-lifecycle/gitsync/pull',
            'development-lifecycle/gitsync/gitsync-backup'
          ]
        }
      ]
    },
    {
      'type': 'category',
      'label': 'Security and Monitoring',
      'collapsed': false,
      'collapsible': false,
      'className': 'category-as-header security-header',
      'items': [
        'security/audit-logs',
        'security/compliance'

      ]
    },
    {
      'type': 'category',
      'label': 'Contributing Guide',
      'link': {
        'type': 'doc',
        'id': 'contributing-guide/index',
      },
      'className': 'category-as-header contributing-header',
      'collapsed': true,
      'collapsible': false,
      'items': [
        'contributing-guide/setup/architecture',
        {
          'type': 'category',
          'label': 'Setup',
          'items': [
            'contributing-guide/setup/codespaces',
            'contributing-guide/setup/docker',
            'contributing-guide/setup/macos',
            'contributing-guide/setup/ubuntu',
            'contributing-guide/setup/windows',
            'contributing-guide/setup/system-requirements',
          ],
        },
        {
          'type': 'category',
          'label': 'Documentation',
          'items': [
            'contributing-guide/documentation-guidelines/introduction',
            'contributing-guide/documentation-guidelines/pr-checklist',
            'contributing-guide/documentation-guidelines/style-guide',
          ],
        },
        {
          'type': 'link',
          'label': 'Roadmap',
          'href': 'https://github.com/orgs/paybilldev/projects/2',
        },
        'paybill-cli',
        'contributing-guide/testing',
        'contributing-guide/l10n',
        {
          'type': 'category',
          'label': 'Troubleshooting',
          'items': [
            'contributing-guide/troubleshooting/eslint',
          ],
        },
        'contributing-guide/code-of-conduct',
        'contributing-guide/discordcoc',
        'release-notes',
        'versions',
      ],
    },
  ],
};

module.exports = sidebars;