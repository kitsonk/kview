# Welcome to kview contributing guide <!-- omit in toc -->

Thank you for investing time in contributing to the project!

Read the [Code of Conduct](./CODE_OF_CONDUCT.md) to keep the community
approachable and respectable.

## Getting started

### Issues and Discussions

If you think you have discovered a defect or you have a suggestion for an
improvement, consider opening an issue.

If you have a question or want to discuss kview generally, the discussion forum
is enabled.

### Making changes

If you have an idea for a change to the project, there are a few things to
consider:

- If the change is substantial, it is best to discuss your change by opening an
  issue so that there is agreement about your change before you put in a lot of
  effort.
- The CI process enforces Deno formatting and linting. It is best to check these
  things locally before raising a pull request.

#### Local development

Developing locally, just like using `kview` as a web app, requires a local
version of the Deno CLI installed. It is recommended that you use the latest
released version.

Changes are accepted through GitHub Pull Requests. Creating your own fork of the
repository and cloning it locally is recommended for making changes.

`kview` is built using [Fresh](https://fresh.deno.dev) and leverages Fresh's
support for (twind)(https://twind.dev/) which provides support for Tailwind for
styling purposes.

Once your change is made, submit it as a pull request. The automated CI will do
initial checks and your PR will be reviewed. Expect feedback on your PR, or even
that your PR might not be merged. Not every change is aligned to the objectives
of this project. This is why it is a good idea to discuss a suggestion for a
change as an issue before expending effort in creating a PR.
