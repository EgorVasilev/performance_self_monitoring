import {Settings, SettingsId} from "../../domain/settings";

export interface SettingsRepository {
    getSettings: (settingsId: SettingsId) => Promise<Settings>
}