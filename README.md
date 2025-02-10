# GitHub Action to Extract Release Notes from a Changelog

[![⚖️ MIT]][mit] [![🎬 Action]][action] [![🧪 Test]][ci]

This action creates a JSON array of Go-supported platform objects. The output
of `go tool dist list -json` generates the initial list, but various inputs
allow for the winnowing of the list. The action also adds an OS-relevant emoji
to each object. An example:

``` json
  {
    "GOOS": "linux",
    "GOARCH": "arm64",
    "CgoSupported": true,
    "FirstClass": true,
    "emoji": "🐧"
  }
```

Here's an example:

``` yaml
name: 🏗️ Build
on:
  push:
jobs:
  platform:
    name: 📋 List Supported Platforms
    runs-on: ubuntu-latest
    steps:
      - name: Setup Go
        uses: actions/setup-go@v5
        with: { go-version-file: go.mod, check-latest: true }
      - name: List First Class Platforms
        uses: theory/go-dist-action@v0
        with:
          first-class-only: true
  build:
    name: Build ${{ matrix.go.emoji }} ${{ matrix.go.GOOS }}/${{ matrix.go.GOARCH }}
    needs: list
    strategy:
      matrix:
        go: ${{ fromJson(needs.platform.outputs.list) }}
    env:
      GOOS: ${{ matrix.go.GOOS }}
      GOARCH: ${{ matrix.go.GOARCH }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Go
        uses: actions/setup-go@v5
        with: { go-version-file: go.mod, check-latest: true }
      - name: Build
        run: go build cmd/my_app.go -o my_app
```

It should work equally well on any platform that supports Go.

## Input Parameters

This action takes the following parameters:

| Key                | Type    | Default   | Description                                         |
| ------------------ | ------- | --------- |---------------------------------------------------- |
| `exclude-os`       | string  | ""        | Space-delimited list of OSes to exclude.      |
| `exclude-arch:`    | string  | ""        | Space-delimited list of architectures to exclude.    |
| `first-class-only` | boolean | false     | Set to true to list only [first-class ports]. |
| `with-cgo-only`    | boolean | false     | Set to true to list only [cgo-enabled ports]. |

## Output Parameters

| Key    | Type | Description                     |
| ------ | ---- | ------------------------------- |
| `list` | JSON | JSON array of platform objects. |

  [Keep a Changelog]: https://keepachangelog.com/en/1.1.0/
  [⚖️ MIT]: https://img.shields.io/badge/License-MIT-blue.svg "⚖️ MIT License"
  [mit]: https://opensource.org/license/MIT "⚖️ MIT License"
  [🧪 Test]: https://github.com/theory/go-dist-action/actions/workflows/test.yml/badge.svg
    "🧪 Test Status"
  [ci]: https://github.com/theory/go-dist-action/actions/workflows/test.yml
    "🧪 Test Status"
  [🎬 Action]: https://img.shields.io/badge/Marketplace-Action-orange.svg "[🎬 Marketplace Action]"
  [action]: https://github.com/marketplace/actions/extract-changelog-release-notes "[🎬 Marketplace Action]"
  [first-class ports]: https://go.dev/wiki/PortingPolicy#first-class-ports
    "Go Porting Policy: First Class Ports"
  [cgo-enabled ports]: https://pkg.go.dev/cmd/cgo "Go Packages: cgo command"
