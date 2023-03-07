# ictunion.cz

![status](https://github.com/ictunion/main-website/actions/workflows/build.yaml/badge.svg?branch=main)

Official public website of "Odborová organizace pracujících v ICT"
hosted on [itcunion.cz](https://itcunion.cz).

We're [Sectoral Trade Union](https://en.wikipedia.org/wiki/Sectoral_collective_bargaining) of wider
[ICT](https://en.wikipedia.org/wiki/Information_and_communications_technology) sector of [Czech Republic](https://en.wikipedia.org/wiki/Czech_Republic).
Our members are Czech citizens, expats working in Czechia, as well as Czech citizens employed or contracted by foreign companies working in
call centers as support operators, programmers, system administrators, testers and QA engineers, designers, artists, analysts, database experts etc.

## Project

Website is composed from template and content written as a markdown files.
We use static site generator called [hugo](https://gohugo.io/) which
produces HTML files that can be served by static HTTP server.
This means that files for web browser are compiled ahead of time
as oppose to rendered dynamically by server while processing the request.

## Contributing

Our development model is highly distributed.
Every contributor has their own copy of the project
which they have complete control over.
Changes from all contributors are merged to the [main repository on GitHub](https://github.com/ictunion/main-website)
by team of trusted maintainers responsible for reviewing, approving and coordinating changes.

Changes to certain documents (e.g. statutes) are democratically voted on and approved from organs of the union
(Membership meeting, Committee of the Organization...).
Maintainer team is fully responsible for ensuring due process and compliance with both legal and organization rules.

**Contributors are obliged to follow [statutes of the organizations](https://union.planning-game.com/downloads/ictunion-statutes-en.pdf)
especially the _Section II. MISSION AND PRINCIPLES OF THE ORGANIZATION_.**

> By submitting pull request contributor automatically pledges the acceptance and respect to
> both [statuses of the organization](https://union.planning-game.com/downloads/ictunion-statutes-en.pdf)
> as well as [license](LICENSE) of the project.

### Project Setup

Accessobility of contributing is very important to us.
We support many different ways to setup the project in order to make contributions
to the projet as frictionless as possible. We do our best to support
all worflows to satisfy experts, free software die hards as well as novices
and non technical users.

Please see documentation specific to your prefered setup:

- [Codespaces](./docs/codespaces.md) no setup in browser environment
- [Docker](./docs/docker.md) containerized local setup
- [Nix](./docs/nix.md) reproducible development evironment
- [Manual Setup Guide](./docs/manual-setup.md) for information regarding requirements

## License

TBA
