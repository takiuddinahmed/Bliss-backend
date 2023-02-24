import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  createToken(createRoomDTO) {
    try {
      const roomName = createRoomDTO.roomName;
      const participantName = createRoomDTO.participant;

      const at = new AccessToken('devkey', 'secret', {
        identity: participantName,
      });
      const grantPermission = {
        ...createRoomDTO,
        room: roomName,
        roomJoin: true
      }
      delete grantPermission.roomName;
      delete grantPermission.participant;
      at.addGrant(grantPermission);

      const token = at.toJwt();
      return token;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
