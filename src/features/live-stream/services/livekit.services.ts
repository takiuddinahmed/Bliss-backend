import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  createToken(createRoomDTO) {
    try {
      const roomName = createRoomDTO.roomName;
      const participantName = createRoomDTO.participant;

      const at = new AccessToken('dev', 'secret', {
        identity: participantName,
      });
      at.addGrant({ roomJoin: true, room: roomName });

      const token = at.toJwt();
      return token;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
