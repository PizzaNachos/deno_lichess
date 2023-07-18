/*TODO
 *  Navigation + telling you where you are
 *  Refactor code
 *  Challenge Friends
 */

import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { readLines } from "https://deno.land/std@0.100.0/io/mod.ts";
import {
  red,
  green,
  blue,
  bold,
  brightGreen,
  brightBlue,
} from "https://deno.land/std/fmt/colors.ts";
import Chess from "./lib/chess.js";

import default_command_handler from "./command_handlers/default_handler.js";
import playing_handler from "./command_handlers/playing_handler.js";

import { config } from "./config.js";

const chess = new Chess();
class ChessCli {
  pgn;
  isInit = false;
  isAuth = false;
  isPlaying = false;

  command_handler;

  #browser;
  #page;
  #navigationPromise;

  constructor() {
    Deno.writeAllSync(
      Deno.stdout,
      new TextEncoder().encode(config.command_line_string)
    );
    console.log("Initialization Started");
    this.init();
  }
  async init() {
    if (!this.isInit) {
      this.#browser = await puppeteer.launch({
        headless: config.headless,
        slowMo: 50,
      });
      this.#page = await this.#browser.newPage();
      this.#navigationPromise = this.#page.waitForNavigation();

      await this.#page.goto("https://lichess.org/");
      await this.#page.setViewport({ width: 500, height: 500 });
      this.command_handler = default_command_handler;
      sleep(2000);

      console.log(bold("Page initialized 500x500 " + red("Not Authenticated")));

      if (config.auto_auth) {
        await this.auth();
      }

      this.command_handler("help");
      Deno.writeAllSync(
        Deno.stdout,
        new TextEncoder().encode(config.command_line_string)
      );

      this.user_input_loop();
      this.isInit = true;
    } else {
      console.log(green("Already init"));
    }
  }
  //If the user is not authenticated authencate them with user.username and user.password
  async auth() {
    if (!this.isAuth) {
      await this.#page.waitForSelector(
        ".dark > #top > .site-buttons > .signin"
      );
      await this.#page.click(".dark > #top > .site-buttons > .signin");

      await this.#navigationPromise;
      await this.#page.waitForSelector(".dark > #main-wrap");
      await this.#page.click(".dark > #main-wrap");

      await this.#page.waitForSelector(".auth #form3-username");
      await this.#page.click(".auth #form3-username");

      await this.#page.type(".auth #form3-username", config.username);

      await this.#page.waitForSelector(".auth #form3-password");
      await this.#page.click(".auth #form3-password");


      await this.#page.type(".auth #form3-password", config.password);

      await this.#page.waitForSelector(
        "#main-wrap > .auth > .form3 > .one-factor > .submit"
      );
      await this.#page.click(
        "#main-wrap > .auth > .form3 > .one-factor > .submit"
      );
      console.log(brightBlue("Auth Successful"));
      Deno.writeAllSync(
        Deno.stdout,
        new TextEncoder().encode(config.command_line_string)
      );
      this.isAuth = true;
      await this.#navigationPromise;
    } else {
      console.log(green("Already Auth"));
    }
  }
  async play(opponent) {
    if (!this.isAuth) {
      console.log(
        "You must be Authenticated to play(Due to how lichess works)\nUse command 'auth' to log in with credentials"
      );
      return;
    }
    switch (true) {
      case opponent.includes("stockfish"):
        const fish_level = prompt("Select Stockfish Level (1-8) : ");
        await this.challenge_stockfish(fish_level);
        this.isPlaying = true;
        this.command_handler = playing_handler;
        break;
      case opponent.toLowerCase().includes("maia"):
        const maia_level = prompt("Select Maia Level (1,5,7) : ");
        await this.challenge_maia(maia_level);
        this.isPlaying = true;
        this.command_handler = playing_handler;
        break;
      default:
        console.log(
          bold(red("Unknown Opponent")),
          `only available opponents are "stockfish" and "maia"\nEx: ${bold(
            "play maia"
          )}`
        );
    }
  }

  async challenge_stockfish(level) {
    
    await this.#page.waitForSelector('.dark > #main-wrap > .lobby > .lobby__table > .lobby__start > .config_ai')
    await this.#page.click('.dark > #main-wrap > .lobby > .lobby__table > .lobby__start > .config_ai')
    
    await this.#page.waitForSelector('#sf_variant')
    await this.#page.click('#sf_variant')
    
    await this.#page.waitForSelector('#sf_variant')
    await this.#page.click('#sf_variant')
    
    await this.#page.waitForSelector('#sf_timeMode')
    await this.#page.click('#sf_timeMode')
    
    await this.#page.waitForSelector('#sf_timeMode')
    await this.#page.click('#sf_timeMode')
    
    await this.#page.waitForSelector(`.level > .config_level > .radio > div:nth-child(${level}) > label`)
    await this.#page.click(`.level > .config_level > .radio > div:nth-child(${level}) > label`)
    
    
    await this.#page.waitForSelector('div > .setup-content > .color-submits > .white > i')
    await this.#page.click('div > .setup-content > .color-submits > .white > i')
    await this.#navigationPromise

    await sleep(3000);
    console.log(`Playing stockfish ${level}`);

    config.print_after_every_move ? await this.print_to_console() : "";
  }

  async challenge_maia(level_origional) {
    let level = 1;
    switch (level_origional) {
      case 1:
        level = 1;
        break;
      case 5:
        level = 2;
        break;
      case 7:
        level = 3;
        break;
    }
    await this.#page.waitForSelector(
      "#top > .site-title-nav > .site-title > a"
    );
    await this.#page.click("#top > .site-title-nav > .site-title > a");

    await this.#navigationPromise;
    await this.#page.waitForSelector("#top > .site-title-nav > .hbg");
    await this.#page.click("#top > .site-title-nav > .hbg");

    await this.#page.waitForSelector(
      "#top > .site-title-nav > #topnav > section:nth-child(5) > a"
    );
    await this.#page.click(
      "#top > .site-title-nav > #topnav > section:nth-child(5) > a"
    );
    await this.#navigationPromise;

    await this.#page.waitForSelector(
      "  > #main-wrap > .page-menu > .page-menu__menu > a:nth-child(5)"
    );
    await this.#page.click(
      "  > #main-wrap > .page-menu > .page-menu__menu > a:nth-child(5)"
    );
    await this.#navigationPromise;

    await this.#page.waitForSelector(
      `.bots__featured > .slist > tbody > tr:nth-child(${level}) > td > .button`
    );
    await this.#page.click(
      `.bots__featured > .slist > tbody > tr:nth-child(${level}) > td > .button`
    );

    await sleep(1000);
    await this.#page.select("select#sf_timeMode", "0");

    await this.#page.select("#modal-wrap #sf_variant", "1");

    await this.#page.waitForSelector("select#sf_timeMode");
    await this.#page.click("select#sf_timeMode");

    await this.#page.select("select#sf_timeMode", "1");

    await this.#page.waitForSelector("select#sf_timeMode");
    await this.#page.click("select#sf_timeMode");

    await this.#page.waitForSelector(
      "div > form > .time_mode_config > .time_choice > .range"
    );
    await this.#page.click(
      "div > form > .time_mode_config > .time_choice > .range"
    );

    await this.#page.waitForSelector(
      "div > form > .time_mode_config > .increment_choice > .range"
    );
    await this.#page.click(
      "div > form > .time_mode_config > .increment_choice > .range"
    );

    await this.#page.waitForSelector(
      "div > form > .color-submits > .white > i"
    );
    await this.#page.click("div > form > .color-submits > .white > i");
    //Wait 5 seconds for bot to accept challenge
    await sleep(3000);
    console.log(`Playing Miai ${level_origional}`);
    this.print_to_console();
  }

  async print_to_console() {
    const move_nums = await this.#page.$$eval("i5z", (nums) => {
      return nums
        .map((num) => {
          return num.innerText;
        })
        .map((num) => {
          return (num += ".");
        });
    });

    const moves = await this.#page.$$eval("kwdb", (moves) => {
      return moves
        .map((move) => {
          return move.innerText;
        })
        .map((num) => {
          return (num += " ");
        });
    });

    let pgn_tmp = "";
    for (let i = 0; i < move_nums.length; i++) {
      pgn_tmp += move_nums[i];
      pgn_tmp += moves[i * 2];
      pgn_tmp += moves[i * 2 + 1];
    }
    if (!pgn_tmp[pgn_tmp.length - 1]) {
      pgn_tmp = pgn_tmp.slice(pgn_tmp.length - 2, pgn_tmp.length);
    }
    chess.load_pgn(pgn_tmp);
    console.log("");
    config.unicode_printing
      ? console.log(chess.unicode())
      : console.log(chess.ascii());
  }

  async make_move(move) {
    move = move.trim();
    await this.#page.keyboard.press("Enter");
    await this.#page.keyboard.press("Backspace");
    await this.#page.keyboard.press("Backspace");
    await this.#page.keyboard.press("Backspace");
    await this.#page.keyboard.press("Backspace");
    await this.#page.keyboard.press("Backspace");
    await this.#page.keyboard.type(move, { delay: 10 });
    await sleep(250);
    await this.check_checkmate();

    config.print_after_every_move ? this.print_to_console() : "";

    const get_last_move = async () => {
      const moves = await this.#page.$$eval("kwdb", (moves) => {
        return moves
          .map((move) => {
            return move.innerText;
          })
          .map((num) => {
            return (num += " ");
          });
      });
      return moves[moves.length - 1];
    };

    const check_moves = async (last_move) => {
      while (true){
        await new Promise(r => setTimeout(r, 1000));
        let new_move = await get_last_move();
        if (last_move == new_move) {
          continue;
        } else {
          await this.check_checkmate();
          if (config.print_after_every_move) {
            this.print_to_console();
          } else {
            console.log(new_move);
          }
          break;
        }
      }
     
    };

    // Wait until we get another move, print to console
    await check_moves(await get_last_move());
  }

  async check_checkmate() {
    const status = await this.#page.$$eval(
      "rm6 > .col1-moves > l4x > .result-wrap > .status",
      (status) => {
        if (status.length == 0) {
          return false;
        } else {
          return status[0].innerText;
        }
      }
    );
    
    if (status) {
      console.log(bold(status));
      this.isPlaying = false;
      this.command_handler = default_command_handler;

      await this.#page.waitForSelector(
        "#top > .site-title-nav > .site-title > a"
      );
      await this.#page.click(
        "#top > .site-title-nav > .site-title > a"
      );

      await this.#navigationPromise;
      this.command_handler("help");
    }
  }

  async resign() {
    await this.#page.waitForSelector(
      ".round__app > .rcontrols > .ricons > .resign > span"
    );
    await this.#page.click(
      ".round__app > .rcontrols > .ricons > .resign > span"
    );

    await this.#page.waitForSelector(
      ".round__app > .rcontrols > .ricons > .act-confirm > .yes"
    );
    await this.#page.click(
      ".round__app > .rcontrols > .ricons > .act-confirm > .yes"
    );

    await this.#page.waitForSelector(
      "#top > .site-title-nav > .site-title > a"
    );
    await this.#page.click("#top > .site-title-nav > .site-title > a");
    await this.#navigationPromise;
    console.log(blue("Resigned"));
    this.command_handler("help");
    this.isPlaying = false;
    this.command_handler = default_command_handler;
  }

  async clear(){
    console.log("\x1b[2J\x1b[1;1H")
  }

  async user_input_loop() {
    (async () => {
      for await (const x of readLines(Deno.stdin)) {
        await this.command_handler(x);
        Deno.writeAllSync(
          Deno.stdout,
          new TextEncoder().encode(config.command_line_string)
        );
      }
    })();
  }
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async function () {
  let c = new ChessCli();
})();
