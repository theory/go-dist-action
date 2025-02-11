# GitHub Action to Extract Release Notes from a Changelog

[![⚖️ MIT]][mit] [![🎬 Action]][action] [![🧪 Test]][ci]

This action creates a JSON array of Go-supported platform objects. The output
of `go tool dist list -json` generates the initial list, but various inputs
allow for the winnowing of the list. The action also adds an OS-relevant emoji
and GitHub runner to each object.

Here's an example:

``` yaml
name: 🏗️ Build
on:
  push:
jobs:
  list:
    name: 📋 List Platforms
    runs-on: ubuntu-latest
    outputs:
      platforms: ${{ steps.list.outputs.platforms }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Go
        uses: actions/setup-go@v5
        with: { go-version-file: go.mod }
      - name: List First Class Platforms
        id: list
        uses: theory/go-dist-action@v0
        with:
          exclude-arch: wasm 386

  build:
    name: ${{ matrix.go.emoji }} Build ${{ matrix.go.GOOS }}/${{ matrix.go.GOARCH }}
    needs: list
    runs-on: ${{ matrix.go.runner }}-latest
    strategy:
      matrix:
        go: ${{ fromJson(needs.list.outputs.platforms) }}
    env:
      GOOS: ${{ matrix.go.GOOS }}
      GOARCH: ${{ matrix.go.GOARCH }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Go
        uses: actions/setup-go@v5
        with: { go-version-file: go.mod }
      - name: Build
        run: go build -o my_app-${{ matrix.go.GOOS }}-${{ matrix.go.GOARCH }} cmd/my_app.go
        continue-on-error: ${{ !matrix.go.FirstClass }}
```

The first job, `list`, uses the action to generate a list of Go-supported
platforms, excluding the `wasm` and `386` architectures. Note that it first
installs the version of Go relevant to the project. It maps the action output
to the job output. This jog runs on an Ubuntu runner, but it should work
equally well on any runner that supports Go.

The second job, `build`, depends on the `list` job, and parses its output into
the `go` matrix value. With the matrix set, it customizes the build name and
GitHub runner and sets the `GOOS` and `GOARCH` environment variables, which
determine the platform `go build` compiles the binary for. The `Build` step
also sets `continue-on-error` to `true` for non-[first-class][first]
platforms. This ensures that all first class platforms must compile without
error, but ignores errors from non-first class platform builds.

## Input Parameters

This action takes the following parameters:

| Key                | Type    | Default   | Description                                         |
| ------------------ | ------- | --------- |---------------------------------------------------- |
| `exclude-os`       | string  | ""        | Space-delimited list of OSes to exclude             |
| `exclude-arch:`    | string  | ""        | Space-delimited list of architectures to exclude    |
| `first-class-only` | boolean | false     | Set to true to list only [first-class ports][first] |
| `with-cgo-only`    | boolean | false     | Set to true to list only [cgo-enabled ports][cgo]   |

## Output Parameters

| Key    | Type | Description                     |
| ------ | ---- | ------------------------------- |
| `list` | JSON | JSON array of platform objects |

Each object in the array has the following keys:

| Key            | Type    | Description                                                    |
| ---------------| ------- |--------------------------------------------------------------- |
| `GOOS`         | string  | The OS name                                                    |
| `GOARCH:`      | string  | The architecture name                                          |
| `CgoSupported` | boolean | True if the platform supports [cgo]                            |
| `FirstClass`   | boolean | True if the platform is considered a [first-class port][first] |
| `runner`       | string  | A likely GitHub runner: `ubuntu`, `macos`, or `windows`        |
| `emoji`        | string  | A single emoji relevant to the OS name                         |

Example:

``` json
  {
    "GOOS": "linux",
    "GOARCH": "arm64",
    "CgoSupported": true,
    "FirstClass": true,
    "runner": "ubuntu",
    "emoji": "🐧"
  }
```

  [Keep a Changelog]: https://keepachangelog.com/en/1.1.0/
  [⚖️ MIT]: https://img.shields.io/badge/License-MIT-blue.svg "⚖️ MIT License"
  [mit]: https://opensource.org/license/MIT "⚖️ MIT License"
  [🧪 Test]: https://github.com/theory/go-dist-action/actions/workflows/test.yml/badge.svg
    "🧪 Test Status"
  [ci]: https://github.com/theory/go-dist-action/actions/workflows/test.yml
    "🧪 Test Status"
  [🎬 Action]: https://img.shields.io/badge/Marketplace-Action-orange.svg "[🎬 Marketplace Action]"
  [action]: https://github.com/marketplace/actions/extract-changelog-release-notes "[🎬 Marketplace Action]"
  [first]: https://go.dev/wiki/PortingPolicy#first-class-ports
    "Go Porting Policy: First Class Ports"
  [cgo]: https://pkg.go.dev/cmd/cgo "Go Packages: cgo command"
