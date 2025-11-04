import { retrieveLaunchParams } from '@tma.js/sdk-react';

interface IMessageBox {
  userSocketId: string;
  messageSocketId: string;
  message: string;
  time: string;
}

export default function MessageBox({ userSocketId, messageSocketId, message, time }: IMessageBox) {
  const isMyMessage = userSocketId == messageSocketId;

  const lp = retrieveLaunchParams();
  const { button_color, bg_color } = lp.tgWebAppThemeParams;


  return (
    <div
      className={`max-w-[80%] mb-4 ${isMyMessage ? "ml-auto" : "mr-auto"}`}>
      <div
        style={{
          backgroundColor: isMyMessage ? button_color : bg_color
        }}
        className={`p-3 rounded-lg ${userSocketId == messageSocketId
          ? "text-white rounded-br-none"
          : "text-white rounded-bl-none"
          }`}>
        {message}
      </div>
      <div className='w-full flex items-end justify-end px-2'>
        <p
          className='text-xs'>
          {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
      </div>
    </div>
  )
}
