package pus.projekt.websocket.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PayloadAction {
    LOGIN("login"),
    REGISTER("register"),
    LOGOUT("logout"),
    REFRESH_TOKEN("refresh_token"),
    LIST("list"),
    CREATE("create"),
    DELETE("delete"),
    JOIN("join"),
    LEAVE("leave"),
    SEND("send");

    private final String value;

    PayloadAction(String value) {
        this.value = value;
    }

@JsonValue
    public String getValue() {
        return value;
    }
}
