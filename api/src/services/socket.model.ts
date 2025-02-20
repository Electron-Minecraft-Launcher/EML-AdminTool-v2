import { Server, Socket as IO } from 'socket.io'

export interface Socket {
  socket: (io: IO) => void
}

