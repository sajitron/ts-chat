import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatMessage, ChatState } from './types';
import { ChatContext } from './ChatContext';

class App extends React.Component {
	// we bring our context into scope
	static contextType = ChatContext;

	state: ChatState = {
		messages: [
			{
				message: "Welcome! Type a message and press 'Send message' to continue the chat.",
				author: 'Bot'
			}
		],
		input: ''
	};

	// * since we have passed the chat context into the global provider which wraps the App component and have also brought our context into scope, we can call the methods present in the socket service class from the App class

	componentDidMount() {
		// initiate socket connection
		this.context.init();

		// retrieve observable
		const observable = this.context.onMessage();

		// subscribe to observable
		observable.subscribe((m: ChatMessage) => {
			let messages = this.state.messages;

			// add incoming message to state
			messages.push(m);
			this.setState({ messages: messages });
		});
	}

	componentWillUnmount() {
		this.context.disconnect();
	}

	render() {
		const updateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
			this.setState({ input: e.target.value });
		};

		const handleMessage = (): void => {
			const author: string = 'Adams';

			if (this.state.input !== '') {
				this.context.send({
					message: this.state.input,
					author: author
				});
				this.setState({ input: '' });
			}
		};

		let msgIndex = 0;
		return (
			<div className="App">
				<img src={logo} alt="logo" className="App-logo" />
				<div className="App-chatbox">
					{this.state.messages.map((msg: ChatMessage) => {
						msgIndex++;
						return (
							<div key={msgIndex}>
								<p>{msg.author}</p>
								<p>{msg.message}</p>
							</div>
						);
					})}
				</div>
				<input
					className="App-Textarea"
					placeholder="Enter your message here..."
					onChange={updateInput}
					value={this.state.input}
				/>
				<p>
					<button
						onClick={() => {
							handleMessage();
						}}
					>
						Send Message
					</button>
				</p>
			</div>
		);
	}
}

export default App;
