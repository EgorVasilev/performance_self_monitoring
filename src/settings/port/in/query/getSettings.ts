import {Settings, SettingsId} from "../../../domain/settings";

export type GetSettingsQuery = (settingsId: SettingsId) => Promise<Settings>