package pus.projekt.websocket.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String ownerName;

    public Room(String name, String description, UUID ownerId, String ownerName) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
    }
}
