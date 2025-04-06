import { UserId } from '../../actors/user/domain/user';
import { PerformanceMetric } from './metrics';

type LayoutColumn = {
    contentId: number;
};

type LayoutRow = [LayoutColumn, LayoutColumn, LayoutColumn];

export type Layout = {
    rows: LayoutRow;
};

export type SettingsId = number;

export type Settings = {
    id: SettingsId;
    enabledMetrics: PerformanceMetric[];
    usersAllowedToSeeMetrics: UserId[];
    usersDeniedToSeeMetrics: UserId[];
    layout: Layout;
};
