import {
    red,
    green,
    blue,
    bold,
    brightGreen,
    brightBlue,
  } from "https://deno.land/std/fmt/colors.ts";

export const config = {
    username: "",
    password: "",
    print_after_every_move: true,
    auto_auth: false,
    headless: false,
    unicode_printing: true,
    command_line_string:
      brightGreen(`cmdlinechess@lichess.org`) + ":" + bold(brightBlue("~/")) + "$ ",
  };
  