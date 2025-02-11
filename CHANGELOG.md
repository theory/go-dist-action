# Changelog

All notable changes to this project will be documented in this file. It uses the
[Keep a Changelog] format, and this project adheres to [Semantic Versioning].

  [Keep a Changelog]: https://keepachangelog.com/en/1.1.0/
  [Semantic Versioning]: https://semver.org/spec/v2.0.0.html
    "Semantic Versioning 2.0.0"

## [v0.1.1] — 2025-01-11

### ⚡ Improvements

*   Fixed broken links and edited the docs.

### 🏗️ Build Setup

*   Published on the GitHub Marketplace

  [v0.1.0]: https://github.com/theory/go-dist-action/compare/v0.1.0...v0.1.1
  [GitHub Marketplace]: https://github.com/marketplace/actions/list-go-platforms

## [v0.1.0] — 2025-01-11

The theme of this release is *Scratching my own itch.*

### ⚡ Improvements

*   First release
*   Extracts the the list of platforms output by `go tool dist list -json`,
    tweaks them according to inputs
*   Adds an OS-relevant emoji value to each platform in the list
*   Adds a GitHub runner OS string to each platform in the list

### 🏗️ Build Setup

*   Made it a GitHub Action!

### 📚 Documentation

*   Wrote a [README]

  [v0.1.0]: https://github.com/theory/go-dist-action/compare/root...v0.1.0
  [README]: README.md
