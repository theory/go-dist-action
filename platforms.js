const { exec } = require('child_process')
const EXCLUDE_OS = process.env.EXCLUDE_OS
const EXCLUDE_ARCH = process.env.EXCLUDE_ARCH
const FIRST_CLASS_ONY = new Boolean(process.env.FIRST_CLASS_ONY)
const WITH_CGO_ONLY = new Boolean(process.env.WITH_CGO_ONLY)

const emojiFor = {
    "aix":       "🟢",
    "android":   "🤖",
    "darwin":    "🍎",
    "dragonfly": "🦋",
    "freebsd":   "😈",
    "illumos":   "🐦‍🔥",
    "ios":       "📱",
    "js":        "🟨",
    "linux":     "🐧",
    "netbsd":    "⛳️",
    "openbsd":   "🐡",
    "plan9":     "🐰",
    "solaris":   "☀️",
    "wasip1":    "🎟️",
    "windows":   "🪟",
}

exec('go tool dist list -json', (err, stdout, stderr) => {
    if (err) {
        console.log(err.message)
        process.exit(2)
    }

    plats = []
    list = JSON.parse(stdout);
    for(const platform of list) {
        if (FIRST_CLASS_ONY && !platform.FirstClass) {
            continue
        }
        if (WITH_CGO_ONLY && !platform.CgoSupported) {
            continue
        }
        if ((new RegExp(`\\b${platform.GOOS}\\b`)).test(EXCLUDE_OS)) {
            continue
        }
        if ((new RegExp(`\\b${platform.GOARCH}\\b`)).test(EXCLUDE_ARCH)) {
            continue
        }
        platform["emoji"] = emojiFor[platform.GOOS] || "⁉️"
        plats.push(platform)
    }
    console.log(JSON.stringify(plats))
});
