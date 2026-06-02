package pus.projekt.websocket.helpers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pus.projekt.websocket.dto.Meta;

@Component
public class VersionValidator {

    private final String supportedVersion = "1.0.0";

    /**
     * Check if version is valid
     */
    public boolean isValid(Meta meta) {
        if (meta == null || meta.version() == null) {
            return false;
        }
        return supportedVersion.equals(meta.version());
    }

    public String getSupportedVersion() {
        return supportedVersion;
    }
}