# kview change log

## Version 0.15.0

- feat: better support for complex values (32accbe)
- feat: add invalid styles when editing (97c1693)

## Version 0.14.10

- fix: styling issue on maps and sets (7de6098)
- fix: minor styling fixes (b5e8a33)

## Version 0.14.9

- fix: minor styling fixes (86045a8)
- refactor: more svg sprites (e0dadf8)

## Version 0.14.8

- fix: upgrade script removes zip file (5cd9c05)
- fix: styling fixups (ba2849f)
- refactor: fully use svg sprites (6aec3b0)

## Version 0.14.7

- fix: upgrade uses deno.land versus jsr (f4d3bd5)

## Version 0.14.6

- fix: don't depend on import map on install (40f316b)

## Version 0.14.5

- fix: properly handle build files on install and upgrade (41d3f6c)

## Version 0.14.4

- fix: properly handle number values (327bdd7)
- chore: update deps (ed00f0d)
- chore: migrate from twind to tailwind (e124c95)

## Version 0.14.3

- chore: update assert imports (814f063)
- chore: update to oak/commons v1 (1966af2)
- chore: update script deps (50bd697)
- chore: migrate to kv-toolbox 0.19 (ddc6eff)
- chore: ci against Deno release and canary (63c296f)

## Version 0.14.2

- fix: handle when path is empty (b27fe82)
- chore: update dependencies (ce92334)
- fix: more spread path fixes (e0eb124)

## Version 0.14.1

- fix: handle key parts with slashes (0af676c)
- fix: decode path to key strings properly (429251b)

## Version 0.14.0

- feat: display encrypted blobs (c08a305)
- fix: hide links for encrypted blobs (32ae865)
- chore: update std (5b53ea5)
- chore: update kv-toolbox (34b95ed)

## Version 0.13.0

- feat: add previews for more blob media types (c6b581f)
- chore: add publish to jsr (f66c748)
- chore: actually add github workflow (8e0f8e3)
- chore: update install entrypoint (5d77d71)

## Version 0.12.0

- feat: rework install and upgrade scripts (5699f2f)
- feat: add preview option to upgrade (7ff284d)

## Version 0.11.0

- feat: add download link to blobs (0af5524)
- feat: support adding and updating blob entries (7ce889c)
- fix: support all allowable data types (f2b4177)
- docs: provide docs on supported data types (912ffe1)

## Version 0.10.2

_bumped version to ensure latest version is available_

## Version 0.10.1

- fix: harden `pathToKey()` (5bb3bd2)
- docs: document blob support (5dd0499)

## Version 0.10.0

- feat: api supports blobs (eb41273)
- feat: ability to view blob entries (faaef1f)
- feat: add blob views for audio and video (b1b9046)

## Version 0.9.1

- feat: correct install manifest (8a7264e)

## Version 0.9.0

- feat: bulk delete interface (10bb88f)
- feat: add upgrade task (2ffd19e)
- chore: migrate to JSR (d66c873)
- chore: add jsr metadata (b13345d)
- docs: add module doc to install.ts (4e8643a)
- docs: update docs and README (0168f2c)

## Version 0.8.1

- fix: type check issue on Jobs component (c0fed97)
- chore: use explicit unstable flag in check task (475ac35)
- chore: update install deps and remove deprecated syntax (b3f5703)

## Version 0.8.0

- feat: support bulk imports (0b6a738)
- fix: change typing and attribute handling for organization details (#7)
- chore: update dependencies (0cf397a)
- chore: remove unused function (349da8d)

## Version 0.7.0

- feat: support watches (f78c8af)

## Version 0.6.0

- feat: support arbitrary local stores (d742aed)
- feat: support bulk exporting (2172856)
- chore: update to fresh 1.6.1 (b327967)
- chore: update std to 0.209.0 (a72d6ca)
- docs: update roadmap (8e38314)

## Version 0.5.0

- feat: support Dates and Errors (dad986d)
- feat: add hex viewer for Uint8Array (78ddb49)
- chore: update to Fresh 1.6 (d9ae025)

## Version 0.4.1

- fix: better sizing JSON edit box (d25f125)
- fix: edit label of local stores (31f3ab7)

## Version 0.4.0

- feat: improve editing values (ebde17b)
- feat: rich JSON editing and display (d3fc0b1)
- chore: update std (449c480)
- chore: minor cleanups (a950742)

## Version 0.3.0

- feat: add breadcrumbs (#2)
- feat: add breadcrumbs to orgs, projects (#3)
- feat: support remote stores (fba563c)
- fix: tweak breadcrumbs (f3df252)
- fix: add background on hover in EditLabel component (#4)
- chore: update fresh (0ec6d05)

## Version 0.2.0

- feat: support adding new entries (24a2bda)
- feat: support editing and adding values (9ca6755)
- feat: support adding subentries and deleting entries (dc74c1c)
- chore: add CI, and CoC (9fba3a0)
- chore: add changelog and contributing (95d6a8b)

## Version 0.1.1

- fix: resolving path for install (445092)

## Version 0.1.0

Initial release 🥳
