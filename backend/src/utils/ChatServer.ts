import * as express from 'express';
import * as socketIO from 'socket.io';
import { ChatEvent } from './constants';
import { ChatMessage } from '../types/types';
import { createServer, Server } from 'http';
let cors = require('cors');

export class ChatServer {
	public static readonly PORT: number = 8080;
	private _app: express.Application;
	private server: Server;
	private io: SocketIO.Server;
	private port: string | number;

	constructor() {
		this._app = express();
		this.port = process.env.PORT || ChatServer.PORT;
		this._app.use(cors());
		this._app.options('*', cors());
		this.server = createServer(this._app);
		this.initSocket();
		this.listen();
	}

	private initSocket(): void {
		this.io = socketIO(this.server);
	}

	private listen(): void {
		this.server.listen(this.port, () => {
			console.log(`Running server on port ${this.port}`);
		});

		this.io.on(ChatEvent.CONNECT, (socket: any) => {
			console.log(`Connected client on port ${this.port}`);

			socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
				console.log(`[server](message): ${JSON.stringify(m)}`);
				this.io.emit('message', m);
			});

			socket.on(ChatEvent.DISCONNECT, () => {
				console.log('Client disconnected');
			});
		});
	}

	get app(): express.Application {
		return this._app;
	}
}
