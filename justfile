_default:
    just --list --unsorted

help: _print_help

setup: _install_dev_dependencies

run: _run-client

build: _build-client

setup-vscode: _vscode _vscode_extensions

# Client commands

_run-client:
    cd client && just run

_build-client:
    cd client && just build

# Server commands

_run-server:
    cd server && just run

_build-server:
    cd server && just build

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
    @echo "     just setup"
    @echo "     just run-client"
    @echo "     just run-server"
    @echo
    @echo " - For more client commands:"
    @echo "     cd client && just"
    @echo
    @echo " - For more server commands:"
    @echo "     cd server && just"
    @echo
    @echo " - To learn more about just:"
    @echo "     open https://cheatography.com/linux-china/cheat-sheets/justfile/"
    @echo
