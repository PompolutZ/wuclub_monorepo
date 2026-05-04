export declare const app: import("hono/hono-base").HonoBase<{}, import("hono/types").BlankSchema | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: null;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {};
            output: {
                fuid: string;
                avatar: string;
                displayName: string;
                role?: string[] | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                fuid: string;
                role: string[];
                displayName: string;
                avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $put: {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                fuid: string;
                displayName: string;
                avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/decks": {
        $get: {
            input: {
                query: {
                    faction?: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin" | undefined;
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                    edition?: string | string[] | undefined;
                    fuid?: string | undefined;
                };
            };
            output: never[] | {
                decks: {
                    [x: string]: any;
                }[];
                total: any;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/v2/users"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    faction?: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin" | undefined;
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                    edition?: string | string[] | undefined;
                    fuid?: string | undefined;
                };
            };
            output: never[] | {
                decks: {
                    [x: string]: any;
                }[];
                total: any;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                deckId: string;
                deck: (string | number)[];
                faction: string;
                name: string;
                private: boolean;
                sets: string[];
                fuid: string;
                createdutc: number;
                updatedutc: number;
                edition?: number | undefined;
                validity?: {
                    nemesis: boolean;
                    rivals: boolean;
                } | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    deckId: string;
                    deck: (string | number)[];
                    faction: string;
                    name: string;
                    private: boolean;
                    sets: string[];
                    edition?: unknown;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    deckId: string;
                    deck: (string | number)[];
                    faction: string;
                    name: string;
                    private: boolean;
                    sets: string[];
                    edition?: unknown;
                };
            };
            output: {
                status: number;
                data: {
                    acknowledged: boolean;
                    insertedId: string;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id": {
        $put: {
            input: {
                json: {
                    deckId?: string | undefined;
                    deck?: (string | number)[] | undefined;
                    faction?: string | undefined;
                    name?: string | undefined;
                    private?: boolean | undefined;
                    sets?: string[] | undefined;
                    edition?: unknown;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                json: {
                    deckId?: string | undefined;
                    deck?: (string | number)[] | undefined;
                    faction?: string | undefined;
                    name?: string | undefined;
                    private?: boolean | undefined;
                    sets?: string[] | undefined;
                    edition?: unknown;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                [x: string]: any;
                _id: string;
            } | null;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                deletedCount: number;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/v2/decks"> | import("hono/types").MergeSchemaPath<{
    "/decks": {
        $get: {
            input: {};
            output: {
                faction: import("@fxdxpz/schema").Factions;
                count: number;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/v2/stats"> | import("hono/types").MergeSchemaPath<{
    "/jobs/recompute-deck-validity": {
        $post: {
            input: {};
            output: {
                total: number;
                updated: number;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/stats/deck-validity": {
        $get: {
            input: {};
            output: {
                total: number;
                public: number;
                missingValidity: number;
                nemesisValid: number;
                publicListable: number;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/v2/admin">, "/v2", "/v2/*">;
export type AppRoutes = typeof app;
