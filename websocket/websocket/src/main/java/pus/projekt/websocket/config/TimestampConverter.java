package pus.projekt.websocket.config;

import java.time.Instant;


public class TimestampConverter {
    /**
     * @return current time as Integer
     */
    public static int currentToSeconds(){
        return (int) Instant.now().getEpochSecond();
    }
}
