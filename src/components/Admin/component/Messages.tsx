import React, { useState } from "react";

const Messages = () => {
  const demoMessageData = [
    {
      id: "1234",
      image: "",
      username: "John Doe",
      messageHeading: "Heading of message",
      message: "This is the message content",
      time: "12:06",
      date: "12 july 2025",
      permissions: [
        {
          perm: "read",
          isGranted: false,
        },
        {
          perm: "create",
          isGranted: true,
        },
        {
          perm: "update",
          isGranted: false,
        },
        {
          perm: "delete",
          isGranted: false,
        },
      ],
    },
    {
      id: "11246",
      image: "",
      username: "John Doe",
      messageHeading: "Heading of message",
      message: "This is the message content",
      time: "12:06",
      date: "12 july 2025",
      permissions: [
        {
          perm: "read",
          isGranted: true,
        },
        {
          perm: "create",
          isGranted: true,
        },
        {
          perm: "update",
          isGranted: false,
        },
        {
          perm: "delete",
          isGranted: false,
        },
      ],
    },
    {
      id: "1111789",
      image: "",
      username: "John Doe",
      messageHeading: "Heading of message",
      message: "This is the message content",
      time: "12:06",
      date: "12 july 2025",
      permissions: [
        {
          perm: "read",
          isGranted: true,
        },
        {
          perm: "create",
          isGranted: true,
        },
        {
          perm: "update",
          isGranted: false,
        },
        {
          perm: "delete",
          isGranted: false,
        },
      ],
    },
    {
      id: "112423411",
      image: "",
      username: "John Doe",
      messageHeading: "Heading of message",
      message: "This is the message content",
      time: "12:06",
      date: "12 july 2025",
      permissions: [
        {
          perm: "read",
          isGranted: true,
        },
        {
          perm: "create",
          isGranted: true,
        },
        {
          perm: "update",
          isGranted: false,
        },
        {
          perm: "delete",
          isGranted: false,
        },
      ],
    },
    {
      id: "5121111",
      image: "",
      username: "John Doe",
      messageHeading: "Heading of message",
      message: "This is the message content",
      time: "12:06",
      date: "12 july 2025",
      permissions: [
        {
          perm: "read",
          isGranted: true,
        },
        {
          perm: "create",
          isGranted: true,
        },
        {
          perm: "update",
          isGranted: false,
        },
        {
          perm: "delete",
          isGranted: false,
        },
      ],
    },
  ];

  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  const toggleMessage = (id: string) => {
    setOpenMessageId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col items-center w-ful">
      {/* <h1 className="text-4xl font-bold w-full mb-10">Messages</h1> */}
      <div className="w-full  mx-auto bg-white dark:bg-zinc-800 dark:text-zinc-300 rounded shadow select-none">
        {demoMessageData.map((msg) => (
          <div key={msg.id} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-900 duration-300">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleMessage(msg.id)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    msg.image
                      ? msg.image
                      : "https://cdn-icons-png.flaticon.com/512/219/219988.png"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <p className="font-semibold">{msg.username}</p>
                <p className="text-sm text-gray-500">{msg.messageHeading}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-semibold">
                  {msg.date}
                </span>
                <span className="text-sm text-gray-400">{msg.time}</span>
                <button className="text-gray-500 hover:text-gray-700 transform transition duration-200">
                  ▼
                </button>
              </div>
            </div>
            {openMessageId === msg.id && (
              <div className="p-4 bg-gray-50 dark:bg-zinc-900 dark:text-zinc-300 border-t text-sm text-gray-600 text-start transition-transform duration-500">
                <div className="flex flex-col gap-4 justify-start">
                  {msg.message}
                  <div className="flex gap-2">
                    <span className="underline">Permissions : </span>

                    {msg.permissions.map((p) => {
                      return (
                        <>
                          {p.isGranted ? <input id={p.perm} type="checkbox" defaultChecked />: <input id={p.perm} type="checkbox" />}
                          <label htmlFor={p.perm}>{p.perm}</label>
                        </>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-start bg-blue-500 max-w-fit text-white font-semibold px-2 py-1 rounded-sm cursor-pointer hover:bg-blue-400 duration-300 active:bg-blue-500">Update Permissions</button>
                    <button className="text-start bg-red-500 max-w-fit text-white font-semibold px-2 py-1 rounded-sm cursor-pointer hover:bg-red-400 duration-300 active:bg-red-500">Reject Permissions</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
