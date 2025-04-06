export interface CodewarsPlatformApi {
    getKataDetails: (kataUrl: string) => Promise<{ difficulty: number }>;
}
