import { useEffect } from 'react';

export function useSocketEvent(socket, event, handler) {
    useEffect(() => {
        if (!event || !handler || !socket) return;

        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [socket, event, handler]);
}