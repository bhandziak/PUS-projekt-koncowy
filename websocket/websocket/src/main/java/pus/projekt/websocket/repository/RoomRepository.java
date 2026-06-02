package pus.projekt.websocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pus.projekt.websocket.model.Room;

import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    Optional<Room> findByName(String name);
}
