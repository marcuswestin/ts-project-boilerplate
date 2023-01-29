# Info
######

_default:
    just --list --unsorted

help: _print_help

# Commands
##########

run: _deps
    just _run_concurrently \
        vit "cd client && just run" \
        api "cd server && just run"

build-run:
    just _run_concurrently \
        client-build "just build-run-client" \
        server-build "just build-run-server"

build-run-client: _deps
    cd client && just build-run

build-run-server: _deps
    docker-compose up --build --remove-orphans


setup-vscode: _deps _vscode _vscode_extensions


# Hidden
########

## Dev dependencies

NVM := "~/.nvm/nvm-exec"
_deps: _brew
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
    if ! which "{{name}}" > /dev/null; then
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
    @echo " - To run in dev mode (server & client):"
    @echo "     just run"
    @echo
    @echo " - To build and run (server & client):"
    @echo "     just build-run"
    @echo
    @echo " - To run server and client seperately in dev mode:"
    @echo "     just run-client"
    @echo "     just run-server"
    @echo
    @echo " - For more commands:"
    @echo "     cd client && just"
    @echo "     cd server && just"
    @echo
    @echo " - To learn more about just:"
    @echo "     open https://cheatography.com/linux-china/cheat-sheets/justfile/"
    @echo
