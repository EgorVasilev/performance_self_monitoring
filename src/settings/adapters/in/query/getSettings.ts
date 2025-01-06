import {SettingsRepository} from "../../../port/out/settingsRepository";
import {SettingsId} from "../../../domain/settings";
import {GetSettingsQuery} from "../../../port/in/query/getSettings";

export const getSettings = (repository: SettingsRepository): GetSettingsQuery => (settingsId: SettingsId) => {
    return repository.getSettings(settingsId);
}
