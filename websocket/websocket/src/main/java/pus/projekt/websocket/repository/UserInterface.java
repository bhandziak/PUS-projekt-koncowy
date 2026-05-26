package pus.projekt.websocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pus.projekt.websocket.model.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserInterface extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
}
