VERSION = $(shell perl -nE '/^\#\# \[([^\]]+)\]/ && do { say $$1; exit }' CHANGELOG.md)

tag:
	@echo Tagging $(VERSION)
	git tag "$(VERSION)" -sm "Tag $(VERSION)"
	git tag v0 -f -sm 'Tag v0'
	git push origin -f v0 $(VERSION)
