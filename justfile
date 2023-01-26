_default:
    just --list --unsorted

help: _print_help

setup: _install_dev_dependencies

run:
    just _run_concurrently \
        vit "cd client && just run" \
        api "cd server && just run"

build:
    just _run_concurrently \
        build-vit "cd client && just build" \
        build-api "cd server && just build"

run-build:
    just _run_concurrently \
        vit-build "cd client && just run-build" \
        api-build "cd server && just run-build"

setup-vscode: _vscode _vscode_extensions

# Helpers
#########

# Dev dependencies

NVM := "~/.nvm/nvm-exec"
_install_dev_dependencies: _brew
    @ just _install_if_not_exists "yarn" "brew install yarn" 
    yarn

_brew:
    @ just _install_if_not_exists "brew" \
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'

## VSCode

_vscode_extensions: _vscode
    code --install-extension skellock.just
    code --install-extension github.copilot
    code --install-extension esbenp.prettier-vscode

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

_run_concurrently name1 cmd1 name2 cmd2:
    yarn concurrently "{{cmd1}}" "{{cmd2}}" \
        --names "{{name1}},{{name2}}" \
        --prefix-colors "bgMagenta.bold,bgBlue.bold" \
         --kill-others-on-fail


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
