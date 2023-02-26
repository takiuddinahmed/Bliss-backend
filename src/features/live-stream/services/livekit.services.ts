import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessToken, RoomServiceClient, Room } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  svc = new RoomServiceClient(
    process.env.LIVEKIT_SERVER,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_SECRET
  )

  createToken(createTokenDTO) {
    try {
      const roomName = createTokenDTO.roomName;
      const participantName = createTokenDTO.participant;

      const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_SECRET,
        {
          identity: participantName,
        },
      );
      const grantPermission = {
        ...createTokenDTO,
        room: roomName,
        roomJoin: true,
      };
      delete grantPermission.roomName;
      delete grantPermission.participant;
      at.addGrant(grantPermission);

      const token = at.toJwt();
      return token;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async listRoom() {
    return await this.svc.listRooms();
  }

  async createRoom(createRoomDTO) {
    const opts = {
      name: createRoomDTO.roomName,
      emptyTimeout: 10 * 60,
      maxParticipants: 100,
    };

    return await this.svc.createRoom(opts);
  }

  async deleteRoom(room: string) {
    return await this.svc.deleteRoom(room);
  }
}
