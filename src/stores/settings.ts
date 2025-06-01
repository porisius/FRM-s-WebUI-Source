import {create} from "zustand/react";
import {persist} from "zustand/middleware";

type SettingsState = {
    baseURL: string;
    setBaseURL: (val: string) => void;

    fetchSpeed: number;
    setFetchSpeed: (val: number) => void;

    mapFetchSpeed: number;
    setMapFetchSpeed: (val: number) => void;

    mapUseInGameColors: boolean;
    setMapUseInGameColors: (val: boolean) => void;

    username: string
    setUsername: (url: string) => void;

    authToken: string;
    setAuthToken: (val: string) => void;

    _hasHydrated: boolean;
    setHasHydrated: (val: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            baseURL: typeof window !== "undefined" ? location.origin : "",
            setBaseURL: (val) => set({baseURL: val}),

            fetchSpeed: 1000,
            setFetchSpeed: (val) => set({fetchSpeed: val}),

            mapFetchSpeed: 2500,
            setMapFetchSpeed: (val) => set({mapFetchSpeed: val}),

            mapUseInGameColors: false,
            setMapUseInGameColors: (val) => set({mapUseInGameColors: val}),

            username: "FRM",
            setUsername: (val) => set({username: val}),

            authToken: "",
            setAuthToken: (val) => set({authToken: val}),

            _hasHydrated: false,
            setHasHydrated: (val) => set({_hasHydrated: val}),
        }),
        {
            name: "frm-settings",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);