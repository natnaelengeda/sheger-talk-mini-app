import { Dispatch, SetStateAction } from 'react';

import LoadingSpinner from './LoadingSpinner';
import { Button, Modal } from '@telegram-apps/telegram-ui'

interface AlertProps {
  open: boolean;
  setCancelOpened: Dispatch<SetStateAction<boolean>>;
  cancelChat: () => void;
  cancelLoading: boolean;
}

export default function CancelAlert({ open, setCancelOpened, cancelChat, cancelLoading }: AlertProps) {
  return (
    <Modal
      open={open}
      onChange={() => setCancelOpened(false)}>
      <div className='w-full h-50 flex flex-col items-center justify-start gap-10 pt-10 px-10 pb-10'>
        <span className='flex flex-col items-center justify-start gap-2'>
          <h1 className='text-xl'>
            Are you sure you want to disconnect?
          </h1>
          <p className=''>You won't meet this person again</p>
        </span>

        <div className='w-full h-auto flex flex-row items-center justify-between gap-10'>
          <Button
            onClick={() => setCancelOpened(false)}
            className='w-full'>
            Cancel
          </Button>
          <Button
            onClick={cancelChat}
            disabled={cancelLoading}
            type=''
            style={{
              backgroundColor: 'red'
            }}
            className='w-full flex flex-row items-center justify-center gap-2'>
            {
              cancelLoading && <LoadingSpinner />
            }
            {
              cancelLoading ? "Disconnecting..." : "Disconnect"
            }
          </Button>
        </div>

      </div>
    </Modal>
  )
}
