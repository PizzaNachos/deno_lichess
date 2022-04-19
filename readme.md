This is a toy puppeteer cli wrapper to play chess on Lichess.org
# Note: Using this violates lichess terms of service and could result in your account being banned
#### For this to work you need to have your account have text input turned on and be in dark mode
Whats Supported:
    Playing against Stockfish locally
    Playing against some (Currently only Maia) online Bots

Config:
    Username: lichess username
    Password: What to log into lichess with
    auth_auth: if it should log into lichess as soon as the page is opened
    headless: if it should launch chrome completely headless
    unicode printing: if when playing it should print the board using unicode characters
    command_line_string: what should be printed between commands: a sudo terminal prompt