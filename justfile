_default:
    just --list --unsorted

help: _print_help

# Commands
##########

run:
    yarn
    yarn vite --open

preview:
    yarn
    yarn vite preview

build:
    yarn
    yarn tsc
    yarn vite build

setup: _install_dev_dependencies

setup-vscode: _vscode _vscode_extensions

# Helpers
#########

# Dev dependencies

NVM := "~/.nvm/nvm-exec"
_install_dev_dependencies: _brew
    @ just _install_if_not_exists "yarn" "brew install yarn" 

_brew:
    @ just _install_if_not_exists "brew" \
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'

## VSCode

_vscode_extensions: _vscode
    code --install-extension skellock.just
    code --install-extension github.copilot

_vscode: _brew
    brew install --cask visual-studio-code

## Functions

_install_if_not_exists name install_cmd:
    #!/bin/zsh
    if ! hash "{{name}}" > /dev/null; then
        echo "install {{name}}"
        echo "Running: '{{install_cmd}}'"
        {{install_cmd}}
    fi

## "just help"

_print_help:
    @echo
    @echo " - To get started:"
    @echo "     just setup run"
    @echo
    @echo " - To learn more about just:"
    @echo "     open https://cheatography.com/linux-china/cheat-sheets/justfile/"
    @echo
