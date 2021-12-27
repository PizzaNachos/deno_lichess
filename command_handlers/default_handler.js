export default async function default_command_handler(cmd){
    switch(true){
      case cmd == 'help':
            const help_messages = [
                'You are at the home screen, Avialible commands:',
                '\tauth [Tries to log you in]',
                '\tplay <oponent> where oponent can be "stockfish" or "maia"',
            ]
            help_messages.forEach(x => console.log(x))
            break;
      case cmd == "auth":
        this.auth()
        break;
      case cmd.startsWith("play"):
        this.play(cmd.slice(4,cmd.length).trim())
        break;
      case cmd.startsWith("checkmate"):
        await this.check_checkmate();
        break;
      default:
        console.log("unknown command")

    }
  }