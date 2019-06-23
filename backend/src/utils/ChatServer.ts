import * as express from 'express';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as helmet from 'helmet';
import * as errorHandler from 'errorhandler';
import { createServer, Server } from 'http';
import connectDB from '../config/db';
import { ChatEvent } from './constants';
import { ChatMessage } from '../types/types';
import authRouter from '../routes/authRouter';

export class ChatServer {
	public static readonly PORT: number = 5500;
	private _app: express.Application;
	private server: Server;
	private io: SocketIO.Server;
	private port: string | number;
	private logFormat: string = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';

	constructor() {
		this._app = express();
		// initialize env variables
		this.initEnv();
		this.port = process.env.PORT || ChatServer.PORT;
		// accept cross-origin requests
		this._app.use(cors());
		// secure app
		this._app.use(helmet());
		// compress http data
		this._app.use(compression());
		// parse requests
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));
		// log requests
		this._app.use(morgan(this.logFormat));
		this._app.options('*', cors());
		this.server = createServer(this._app);
		this.setAuthRoute();
		this.serverStatic();
		this.initDB();
		this.initErrorHandler();
		this.initSocket();
		this.listen();
	}

	private initEnv(): void {
		dotenv.config();
	}

	private initDB(): void {
		connectDB();
	}

	private initErrorHandler(): void {
		if (process.env.NODE_ENV === 'development') {
			this.app.use(errorHandler());
		}
	}

	private serverStatic(): void {
		if (process.env.NODE_ENV === 'production') {
			// set static folder
			this.app.use(express.static(path.join(__dirname, '../', '../', '../', 'client/build')));

			this.app.get('*', (_req: express.Request, res: express.Response) => {
				res.sendFile(path.join(__dirname, '../', '../', '../', 'client/build/index.html'));
			});
		}
	}

	// * setup api routes
	private setAuthRoute(): void {
		authRouter(this.app);
	}
	// ? setup static file serving for dev environment

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
