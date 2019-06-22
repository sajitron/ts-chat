// import context APIs and SocketService

import React, { useContext } from 'react';
import { SocketService } from './SocketService';

// create new context

// we create a chatcontext which takes in an instance of socketservice as argument

export const ChatContext: React.Context<SocketService> = React.createContext(new SocketService());

// functional component context hook
export const useChat = () => useContext(ChatContext);
