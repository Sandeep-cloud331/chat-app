import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './chatHeader';
import MessageInput from './messageInput';
import MessageSkeleton from './skeletons/MessageSleleton';
import { formatMessageTime } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeTomessage,
    unSubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const chatContainerRef = useRef(null);
  const messageEndRef = useRef(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (selectedUser._id) {
      // Reset `isInitialLoad` when switching users
      if (currentUserId !== selectedUser._id) {
        setIsInitialLoad(true);
        setCurrentUserId(selectedUser._id);
      }
      getMessages(selectedUser._id);
      subscribeTomessage();

      return () => {
        unSubscribeToMessages();
      };
    }
  }, [selectedUser._id, getMessages, subscribeTomessage, unSubscribeToMessages, currentUserId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      if (isInitialLoad) {
        setTimeout(() => {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          setIsInitialLoad(false);
        }, 0);
      } else {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isInitialLoad]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={chatContainerRef}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? 'chat-end' : 'chat-start'
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || '/avatar.png'
                      : selectedUser.profilePic || '/avatar.png'
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {/* Ref for scrolling to the bottom */}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;