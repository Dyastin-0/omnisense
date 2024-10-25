import React, { useEffect, useRef, useState } from "react";

import "./logs.css";

import { formatTime } from "../../utils/time";

import { useData } from "../../contexts/data/data";
import { Loading } from "../loading/loading";
import { useAuth } from "../../contexts/auth/auth";

import { Log } from "./log";

export const MessagePanel = () => {
  const { user } = useAuth();
  const { messages, isFetching } = useData();
  const messageContainerRef = useRef(null);

  const [renderedMessages, setRenderedMessages] = useState([]);
  useEffect(() => {
    const renderMessages = () => {
      if (user) {
        const rendered = Object.entries(
          messages.length > 20
            ? messages.slice(messages.length - 21, messages.length)
            : messages
        ).map(([key, value]) => (
          <Log
            isMessageOwner={user && user.displayName === value.sentBy}
            key={key}
            message={value.message}
            timeSent={formatTime(value.timeSent)}
            sentBy={value.sentBy}
          />
        ));
        setRenderedMessages(rendered);
      }
    };

    messages && renderMessages();
  }, [messages, user]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [renderedMessages]);

  return (
    <div className="content-panel">
      <h3> Logs </h3>
      <div className="container" ref={messageContainerRef}>
        {!isFetching && renderedMessages.length > 0 ? (
          renderedMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))
        ) : (
          <Loading text="No logs to display." />
        )}
      </div>
    </div>
  );
};
