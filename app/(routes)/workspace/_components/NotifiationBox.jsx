import React, { useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { useInboxNotifications, useUnreadInboxNotificationsCount, useUpdateRoomNotificationSettings } from "@liveblocks/react/suspense";
  import {
    InboxNotification,
    InboxNotificationList,
  } from "@liveblocks/react-ui";
  
function NotifiationBox({children}) {
  
    const { inboxNotifications } = useInboxNotifications();
    const updateRoomNotificationSettings=useUpdateRoomNotificationSettings();
    const { count, error, isLoading } = useUnreadInboxNotificationsCount();

    // console.log("Over here :-" , inboxNotifications , count)

    useEffect(() => {
      if (count > 0) {
        try {
          updateRoomNotificationSettings({ threads: 'all' });
        } catch (error) {
          console.log(error);
        }
      }
    }, [count]);
  
    return (
    <Popover>
    <PopoverTrigger>
        <div className='flex gap-1'>
    {children} <span className='p-1 px-2 -ml-3 rounded-full text-[7px] bg-primary text-white'>{count}</span>
        </div></PopoverTrigger>
    <PopoverContent className={'w-[500px]'}>
    <InboxNotificationList>
    {inboxNotifications
      .filter((n) => n.readAt === null) // Only show unread notifications
      .map((inboxNotification) => (
        <InboxNotification
          key={inboxNotification.id}
          inboxNotification={inboxNotification}
        />
    ))}
    </InboxNotificationList>
    </PopoverContent>
  </Popover>
  
  )
}

export default NotifiationBox