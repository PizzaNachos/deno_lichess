export default async function playing_handler(cmd){
    switch(true){
        case cmd == 'help':
            const help_messages = [
                'You are playing a game, Available commands:',
                '\tresign [Resigns the game]',
                '\toffer draw [Offers a draw]',
                '\tchat <message> [Sends a message to your opponent]',
                '\tprint [Prints the board as is currently is (in ascii)]',
                '\t<move> tries to make the specified move',
            ]
            help_messages.forEach(x => console.log(x))
            break;
        case cmd == 'resign':
            await this.resign();
            break;
        case cmd == 'offer draw':
            await this.offerDraw();
            break;
        case cmd.startsWith('chat'):
            this.sendChat(cmd.slice(4,cmd.length).trim());
            break;
        case cmd == "print":
            await this.print_to_console();
            break;
        case cmd == "clear":
                await this.clear();
                break;
        default:
            await this.make_move(cmd)
    }
}